import React from 'react';
import ReactDOM from 'react-dom';
import {render} from '@testing-library/react';
import type {LngLat, MMap} from '@mappable-world/mappable-types';

describe('React MMap test', () => {
    const LOCATION = {center: [37.62, 55.75] as LngLat, zoom: 12};
    let container: HTMLElement;
    let map: MMap;

    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: '640px', height: '480px'});

        document.body.appendChild(container);
    });

    afterEach(() => {
        map?.destroy();
        container?.remove();
    });

    it('should make react map', async () => {
        expect(mappable).toBeDefined();

        const [mappableReact] = await Promise.all([
            mappable.import('@mappable-world/mappable-reactify'),
            mappable.ready
        ]);
        const reactify = mappableReact.reactify.bindTo(React, ReactDOM);
        expect(reactify).toBeDefined();

        const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControl} =
            reactify.module(mappable);
        expect(MMap).toBeDefined();

        render(
            <MMap location={LOCATION} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />

                <MMapControls position="left">
                    <MMapControl>
                        <div>test control</div>
                    </MMapControl>
                </MMapControls>
            </MMap>,
            {
                container
            }
        );

        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });
});
