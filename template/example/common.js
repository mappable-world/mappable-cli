mappable.import.loaders.unshift(async (pkg) => {
    if (!pkg.includes('%PACKAGE_NAME%')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await mappable.import.script(`/dist/index.js`);
    } else {
        await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }

    Object.assign(mappable, window[`${pkg}`]);
    return window[`${pkg}`];
})


const BOUNDS = [
    [54.58311, 25.99850],
    [56.30248, 24.47889]
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOCATION = {bounds: BOUNDS};
