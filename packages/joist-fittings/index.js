"use strict"

const jscad = require('@jscad/modeling')

const {
    cube,
    cylinder,
    sphere,
    cylinderElliptic,
    circle,
    cuboid,
    roundedCuboid,
    roundedCylinder,
    roundedRectangle,
    rectangle,
    triangle,
} = jscad.primitives

const {
    align,
    translate,
    rotate,
    mirror
} = jscad.transforms

const {
    intersect,
    subtract,
    union,
    scission
} = jscad.booleans

const {
    extrudeLinear,
    extrudeRotate,
    project
} = jscad.extrusions

const {
    measureDimensions,
    measureBoundingBox,
    measureVolume
} = jscad.measurements

const {
    hull,
    hullChain
} = jscad.hulls

const { vectorText } = jscad.text
const { toOutlines } = jscad.geometries.geom2
const { TAU } = jscad.maths.constants
const { colorize } = jscad.colors

const swcadJs = require('swcad-js').init({ jscad });

const {
    math,
    position,
} = swcadJs.calcs

const {
    layout,
} = swcadJs.utils

const dowelAssemblyFittingsModule = require('./src/dowel-joist-panel-fittings.js')
const dowelAssemblyFittings = dowelAssemblyFittingsModule.init({ jscad, swcadJs })

const railFramesModule = require('./src/rail-frames.js')
const railFrames = railFramesModule.init({ jscad, swcadJs })

const rightAngleBracketsModule = require('./src/right-angle-brackets.js')
const rightAngleBrackets = rightAngleBracketsModule.init({ jscad, swcadJs })

//==============================================================================


/* ----------------------------------------
 * Model / Scene Prep
 * ------------------------------------- */

const commonOpts = {
    // dowelRadius: 8.5 / 2,
    dowelRadius: 3.5 / 2,
    dowelCtrDistance: math.inchesToMm(1.25),
}

const commonRailFrameOpts = {
    ...commonOpts,
    size: [200, 120],
}

const rightAngleBracketsOpts = {
    ...commonOpts,
    widthToJoistCtr: math.inchesToMm(1.5),
    depthToJoistCtr: math.inchesToMm(1.5),
    height: math.inchesToMm(1 / 8),
    thickness: math.inchesToMm(5 / 32),
}


//------------------------------------------------------------------------------

const panelWidth = math.inchesToMm(4)
const panelLength = math.inchesToMm(4)
const panelOffsetTotal = math.inchesToMm(1 / 16)
const panelDowelDiam = 3.25
const panelDowelRadius = panelDowelDiam / 2


// const angleConnectorData = dowelAssemblyFittings.angleConnector({
//     ...commonOpts,
// })
// const angleConnectorModel = angleConnectorData[0]
// const angleConnectorProps = angleConnectorData[2]
// console.log('angleConnectorProps', angleConnectorProps)

// const angleCornerConnectorData = dowelAssemblyFittings.angleCornerConnector({
//     ...commonOpts,
// })
// const angleCornerConnectorModel = angleCornerConnectorData[0]
// const angleCornerConnectorProps = angleCornerConnectorData[2]
// console.log('angleCornerConnectorProps', angleCornerConnectorProps)

// const flatConnectorData = dowelAssemblyFittings.flatConnector({
//     ...commonOpts,
// })
// const flatConnectorModel = flatConnectorData[0]
// const flatConnectorProps = flatConnectorData[2]
// console.log('flatConnectorProps', flatConnectorProps)

// const mortiseConnectorData = dowelAssemblyFittings.mortiseConnector({
//     ...commonOpts,
// })
// const mortiseConnectorModel = mortiseConnectorData[0]
// const mortiseConnectorProps = mortiseConnectorData[2]
// console.log('mortiseConnectorProps', mortiseConnectorProps)

// const endConnectorData = dowelAssemblyFittings.endConnector({
//     ...commonOpts,
// })
// const endConnectorModel = endConnectorData[0]
// const endConnectorProps = endConnectorData[2]
// console.log('endConnectorProps', endConnectorProps)

const baseRail = railFrames.baseRailFrame({
    ...commonRailFrameOpts
})[0]

const simpleRailFrame = railFrames.simpleRailFrame({
    ...commonRailFrameOpts
})[0]

const simpleJoistRailBracket = railFrames.simpleJoistRailBracket({
    ...commonRailFrameOpts
})[0]

const joistRailBracket = railFrames.joistRailBracket({
    ...commonRailFrameOpts
})[0]

const singleRailFrame = railFrames.singleRailFrame({
    ...commonRailFrameOpts
})[0]

const doubleRailFrame = railFrames.doubleRailFrame({
    ...commonRailFrameOpts
})[0]

const rightAngleColumnBracketInt = rightAngleBrackets.rightAngleColumnBracket({
    ...rightAngleBracketsOpts
})[0]

const rightAngleColumnBracketExt = rightAngleBrackets.rightAngleColumnBracket({
    ...rightAngleBracketsOpts,
    orientation: 'external'
})[0]


const layoutOpts = {
    layoutMargin: math.inchesToMm(2),
    layoutSpace: math.inchesToMm(2),
}


/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 */
function main() {
    // layout.addToLayout({
    //     name: 'angleConnectorModel',
    //     desc: '...',
    //     layoutOpts,
    // }, angleConnectorModel);

    // layout.addToLayout({
    //     name: 'angleCornerConnectorModel',
    //     desc: '...',
    //     layoutOpts,
    // }, angleCornerConnectorModel);

    // layout.addToLayout({
    //     name: 'flatConnectorModel',
    //     desc: '...',
    //     layoutOpts,
    // }, flatConnectorModel);

    // layout.addToLayout({
    //     name: 'mortiseConnectorModel',
    //     desc: '...',
    //     layoutOpts,
    // }, mortiseConnectorModel);

    // layout.addToLayout({
    //     name: 'endConnectorModel',
    //     desc: '...',
    //     layoutOpts,
    // }, endConnectorModel);

    // const layoutContent = layout.gridLayout({ layoutOpts });

    // return layoutContent;

    return rightAngleColumnBracketExt
}


module.exports = {
    main,
}
