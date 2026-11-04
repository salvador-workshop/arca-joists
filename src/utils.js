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

const unpackDate = (inputDate) => {
    const [month, day, year, hour, minutes, seconds, milliseconds] = [
        inputDate.getMonth(),
        inputDate.getDate(),
        inputDate.getFullYear(),
        inputDate.getHours(),
        inputDate.getMinutes(),
        inputDate.getSeconds(),
        inputDate.getMilliseconds(),
    ];

    return {
        month,
        day,
        year,
        hour,
        minutes,
        seconds,
        milliseconds
    }
}

const dateTagDay = (unpackedDate) => {
    const fMonth = String(unpackedDate.month).padStart(2, '0');
    const fDay = String(unpackedDate.day).padStart(2, '0');

    const dTagDay = `${unpackedDate.year}-${fMonth}${fDay}`

    return dTagDay
}

const dateTagTime = (unpackedDate) => {
    const fHours = String(unpackedDate.hour).padStart(2, '0');
    const fMins = String(unpackedDate.minutes).padStart(2, '0');
    const fSecs = String(unpackedDate.seconds).padStart(2, '0');
    const fMilli = String(unpackedDate.milliseconds).padStart(3, '0');

    const dTagTime = `${fHours}${fMins}${fSecs}${fMilli}`

    return dTagTime
}

const formatParamsToCmdString = (modelParameters) => {
    //   jscad name_plate.jscad --name "Just Me" --title "CEO"

    const paramStrs = []
    for (const param in modelParameters) {
        const paramVal = modelParameters[param]
        paramStrs.push(`--${param} "${paramVal}"`)
    }

    return paramStrs.join(' ')
}

export const utils = {
    configPath,
    inputDir,
    outputDir,
    unpackDate,
    dateTagDay,
    dateTagTime,
    formatParamsToCmdString,
}

export const arcaConfig = JSON.parse(arcaConfigJsonContent);

console.log(arcaConfigJsonContent);
console.log(arcaConfig);
console.log(typeof arcaConfig);