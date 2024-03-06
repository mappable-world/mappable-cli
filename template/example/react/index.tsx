import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = reactify.module(mappable);

    const {useState, useCallback} = React;

    const {MMapZoomControl} = reactify.module(await mappable.import('@mappable-world/mappable-controls@0.0.1'));

    const {MMapButtonExample} = reactify.module(await mappable.import('%PACKAGE_NAME%'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location, setLocation] = useState(LOCATION);
        const onClick = useCallback(() => alert('Click!'), []);

        return (
            <MMap location={location} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="right">
                    <MMapZoomControl />
                    <MMapButtonExample text={'My button'} onClick={onClick} />
                </MMapControls>
            </MMap>
        );
    }
}
