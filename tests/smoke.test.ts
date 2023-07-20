import type {LngLatBounds} from '@mappable-world/mappable-types/common/types';
import type {MMap} from "@mappable-world/mappable-types";

describe('MMap smoke test', () => {
    const BOUNDS: LngLatBounds = [
        [54.58311, 25.99850],
        [56.30248, 24.47889]
    ];

    const LOCATION = {bounds: BOUNDS};

    let container: HTMLElement, map: MMap;
    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: `643px`, height: `856px`});
        document.body.appendChild(container);
        map = new mappable.MMap(container, {location: LOCATION}, [
            new mappable.MMapDefaultSchemeLayer({})
        ]);
    })

    afterEach(() => {
        map.destroy();
        container.remove();
    })

    it('should make map', () => {
        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });
});
