import type {LngLatBounds} from '@mappable-world/mappable-types/common/types';
import {MMap} from '@mappable-world/mappable-types';
import {MMapButtonExample} from './MMapButtonExample';

describe('MMap smoke test', () => {
    const BOUNDS: LngLatBounds = [
        [54.58311, 25.9985],
        [56.30248, 24.47889]
    ];

    const LOCATION = {bounds: BOUNDS};

    let container: HTMLElement, map: MMap;
    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: `643px`, height: `856px`});
        document.body.appendChild(container);
        map = new mappable.MMap(container, {location: LOCATION}, [new mappable.MMapDefaultSchemeLayer({})]);
    });

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('should make map', () => {
        map.addChild(
            new mappable.MMapControls({position: 'bottom'}, [
                new MMapButtonExample({
                    text: 'Some text',
                    className: 'user-class',
                    onClick: () => {
                        console.log('Click!');
                    }
                })
            ])
        );

        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });
});
