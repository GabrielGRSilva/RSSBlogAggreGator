import {setUser, readConfig} from './config.js';

function main() {
    setUser('Gabriel Silva');
    console.log(readConfig());
};

main();