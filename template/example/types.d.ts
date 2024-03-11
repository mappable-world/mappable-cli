import {MMap} from '@mappable-world/mappable-types';

declare global {
    const React: typeof import('react');
    const ReactDOM: typeof import('react-dom');
    const Vue: typeof import('@vue/runtime-dom');
    let map: MMap;

    interface Window {
        map: MMap;
    }
}

export {};
