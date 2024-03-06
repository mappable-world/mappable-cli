import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = vuefy.module(mappable);

    const {MMapZoomControl} = vuefy.module(await mappable.import('@mappable-world/mappable-controls@0.0.1'));

    const {MMapButtonExample} = vuefy.module(await mappable.import('%PACKAGE_NAME%'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapZoomControl,
            MMapButtonExample
        },
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            const onClick = () => alert('Click!');
            return {LOCATION, refMap, onClick};
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="right">
                    <MMapZoomControl />
                    <MMapButtonExample text="My button" :onClick="onClick" />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
