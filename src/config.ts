import fs from "fs";
import os from "os";
import path from "path";

const homeDir = os.homedir();

export type Config = { //Representes JSON structure
  dbUrl: string,
  currentUserName: string
};

export function setUser(username: string): void { //Writes new Config in JSON file with passed username
    const path = getConfigFilePath();

    const data = fs.readFileSync(path, 'utf-8');

    const startConfig: Config ={
        dbUrl: "postgres://example",
        currentUserName: username
    };

    const cfg = JSON.stringify(startConfig);

    if (!data.includes("cfg")){ //Check if config isnt already in file
        fs.writeFileSync(path, cfg);
    };

};

export function readConfig(): Config{ //Returns Config object from .gatorconfig.json
    const data = fs.readFileSync(getConfigFilePath(), 'utf-8');

    const cfgParse = JSON.parse(data);

    if (validateConfig(cfgParse)){
        return cfgParse;
    }else{
        throw new Error('Failed to parse .gatorconfig.json into Config type!');
    };
};

function getConfigFilePath(): string {
    return path.join(homeDir, ".gatorconfig.json");
};

function validateConfig(rawConfig: any): boolean { //used by readConfig to validate the result of JSON.parse
    return (typeof rawConfig === 'object' &&
        rawConfig != null &&
        'dbUrl' in rawConfig &&
        typeof rawConfig.dbUrl === 'string' &&
        'currentUserName' in rawConfig &&
        typeof rawConfig.currentUserName === 'string');
};