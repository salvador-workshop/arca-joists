import { exec } from "child_process";
import {
    readFileSync,
    lstatSync,
    readdirSync,
    existsSync,
    mkdirSync,
} from 'node:fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const configPath = join(__dirname, '../arca.config.json')
const inputDir = join(__dirname, '../input')
const outputDir = join(__dirname, '../output')

const arcaConfigJsonContent = readFileSync(configPath);

export const utils = {
    configPath,
    inputDir,
    outputDir,
}

export const arcaConfig = JSON.parse(arcaConfigJsonContent);

console.log(arcaConfigJsonContent);
console.log(arcaConfig);
console.log(typeof arcaConfig);