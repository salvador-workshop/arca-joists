// const { exec } = require("child_process");
// const fs = require('node:fs');

import { exec } from "child_process";
import {
    lstatSync,
    readdirSync,
    existsSync,
    mkdirSync,
} from 'node:fs';
import { join, relative } from 'path';

import {
    utils,
    arcaConfig
} from './utils'

import {
    draftUtils
} from './draft-utils'

const inputDir = utils.inputDir
const outputDir = utils.outputDir

const arcaConfigJsonData = arcaConfig

let detectedProject = false
let detectedBuildConfigs = false
let errMsg = ''

console.log('----------------------------------------------------------------\n')
console.log('> Preparing to run JSCAD with files from `src/input/`...')

const currentDateData = utils.unpackDate(new Date())
const dateTagDay = utils.dateTagDay(currentDateData)
const dateTagTime = utils.dateTagTime(currentDateData)

const projId = `organizer-${dateTagDay}-${dateTagTime}`

const projOutputDir = join(outputDir, projId)
// const cmdString = `npx jscad src/input/${projId}/ -o output/${projId}/${projId}.stl`
const cmdString = `npx jscad input/${projId}/ -gp -o output/`

// create output folder
try {
    if (!fs.existsSync(projOutputDir)) {
        fs.mkdirSync(projOutputDir);
    }
} catch (err) {
    console.error(err);
}

// run JSCAD
exec(cmdString, (err, stdout, stderr) => {
    if (err) {
        console.error();
        console.error("Error:");
        console.error(err);
        console.error();
    }
    console.log(stdout);
    console.error(stderr);
});

console.log('\n----------------------------------------------------------------\n')
