import fs from "fs";
import os from "os";
import path from "path";

export type Config = { //Representes JSON structure
  dbUrl: string,
  currentUserName: string
};


export function checkGatorConfig(): void { //Checks and creates .gatorconfig.json if it doesnt exist
    const cfgPath = getConfigFilePath();

    if (!fs.existsSync(cfgPath)){

        const standardGator: Config = { 
            dbUrl: "postgres://example",
            currentUserName: "" 
        };

        fs.writeFileSync(cfgPath, JSON.stringify(standardGator));
    };
};

export function setUser(username: string): void { //Writes new Config in JSON file with passed username
    const cfgPath = getConfigFilePath();
    const cfg = fs.existsSync(cfgPath)
    ? readConfig()
    :{dbUrl: "postgres://example", currentUserName: "" };

    cfg.currentUserName = username;
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2)+"\n");
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
    return path.join(os.homedir(), ".gatorconfig.json");
};

function validateConfig(rawConfig: any): boolean { //used by readConfig to validate the result of JSON.parse
    return (typeof rawConfig === 'object' &&
        rawConfig != null &&
        'dbUrl' in rawConfig &&
        typeof rawConfig.dbUrl === 'string' &&
        'currentUserName' in rawConfig &&
        typeof rawConfig.currentUserName === 'string');
};