import {setUser, readConfig} from './config';

function main() {
    setUser('Gabriel Silva');
    console.log(readConfig());
};

main();