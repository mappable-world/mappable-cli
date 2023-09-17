import {argv} from './args';
import {create} from './controllers/create';
import {example} from './controllers/example';

(async () => {
    const command = argv._[0];
    switch (command) {
        case 'example':
            await example();
            break;

        default:
            await create();
            break;
    }

    process.exit();
})();
