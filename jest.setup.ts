import got from 'got';
import vm from 'vm';
import {JSDOM} from 'jsdom';
import fetch from 'cross-fetch';
import * as path from 'path';

Object.assign(process.env, require('dotenv').config());

if (!process.env.APIKEY) {
    throw new Error('Define APIKEY env');
}

const REFERRER = process.env.REFERRER || 'http://mappable.localhost/';
const API_HOST = process.env.APIHOST || 'https://js.api.mappable.world/3.0/';
const API_URL = `${API_HOST}?apikey=${process.env.APIKEY}&lang=en_US`;
const NS = process.env.NAMESPACE || 'mappable';

const computeClientDimension = (element: HTMLElement, dimension: 'width' | 'height') => {
    const path = [];

    do {
        const style = getComputedStyle(element);
        const styleStr = `width: ${style.width}; height: ${style.height}`;
        path.push(`<${element.tagName.toLowerCase()} class="${element.className}" style="${styleStr}">`);

        if (!style[dimension]) break;
        if (style[dimension] === '100%') {
            element = element.parentElement;
            continue;
        }
        if (style[dimension].endsWith('px')) {
            return parseFloat(style[dimension]);
        }

        break;

        // eslint-disable-next-line no-constant-condition
    } while (true);

    const pathFormatted = path
        .reverse()
        .map((x, i) => '  '.repeat(i) + x)
        .join('\n');

    throw new Error(`Cannot compute ${dimension}:\n${pathFormatted}`);
};

module.exports = async function () {
    const dom = await JSDOM.fromFile(path.resolve(__dirname, 'index.html'), {
        url: REFERRER
    });

    const appendChild = dom.window.document.head.appendChild.bind(dom.window.document.head);
    dom.window.document.head.appendChild = <T extends Node>(script: T): T => {
        if (isScript(script)) {
            loadAndExecuteScript(script.src)
                .then(() => script.dispatchEvent(new dom.window.Event('load')))
                .catch((e) => console.log('Error', e));
        }

        return appendChild(script);
    };

    const context: any = {
        ...dom.window,
        Node: dom.window.Node,
        DOMException: class extends Error {
            constructor(message: string, name: string) {
                super(message);
                this.name = name;
            }
        },
        MouseEvent: dom.window.MouseEvent,
        Image: dom.window.Image,
        HTMLElement: dom.window.HTMLElement,
        Element: dom.window.Element,
        XMLHttpRequest: dom.window.XMLHttpRequest,
        window: dom.window,
        global: dom.window,

        self: new Proxy(
            {},
            {
                get(_, p) {
                    return Reflect.get(context, p);
                },
                set(_, p, newValue) {
                    Reflect.set(context, p, newValue);
                    return true;
                }
            }
        ),

        domToJson,
        console,
        AbortController,
        clearTimeout,
        setTimeout,
        performance,
        URL,
        URLSearchParams,
        queueMicrotask: (cb: Function) => cb(),
        requestAnimationFrame: (cb: Function) => cb(),
        fetch: (url: string, query: object) =>
            fetch(url, {
                ...query,
                // agent: agent,
                headers: {
                    referer: REFERRER
                }
            }),
        ResizeObserver: function () {
            return {
                disconnect() {},
                observe() {}
            };
        }
    };

    Object.defineProperties(dom.window.Element.prototype, {
        clientWidth: {
            get() {
                return computeClientDimension(this, 'width');
            }
        },
        clientHeight: {
            get() {
                return computeClientDimension(this, 'height');
            }
        }
    });

    async function loadAndExecuteScript(url: string) {
        const data = await got(url, {
            headers: {
                Referer: REFERRER
            }
        });

        await vm.runInNewContext(data.body, context);
    }

    await loadAndExecuteScript(API_URL);
    await context[NS].ready;

    Object.assign(global, context);
};

function isScript(node: Node): node is HTMLScriptElement {
    return node.nodeName === 'SCRIPT';
}

function isElement(node: Node): node is Element {
    return node.nodeType === Node.ELEMENT_NODE;
}

function domToJson(e: Node | ChildNode | null): TreeNode {
    const result: TreeNode = {
        nodeName: e.nodeName.toLowerCase(),
        attributes: isElement(e)
            ? Array.from(e.attributes).reduce((acc, {name, value}) => {
                  acc[name] = value;
                  return acc;
              }, {} as TreeNode['attributes'])
            : {}
    };

    if (e.childNodes.length) {
        result.children = Array.from(e.childNodes, (e) =>
            e.nodeType === Node.TEXT_NODE ? e.textContent : domToJson(e)
        );
    }

    return result;
}
