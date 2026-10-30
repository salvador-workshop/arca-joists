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

const dowelJoistPanelModule = require('./src/dowel-joist-panel.js')
const dowelJoistPanel = dowelJoistPanelModule.init({ jscad, swcadJs })

const dowelJoistSetModule = require('./src/dowel-joist-set.js')
const dowelJoistSet = dowelJoistSetModule.init({ jscad, swcadJs })

//==============================================================================


/* ----------------------------------------
 * Model / Scene Prep
 * ------------------------------------- */

const spaceUnit = math.inchesToMm(2)
const layoutOpts = {
    layoutMargin: math.inchesToMm(2),
    layoutSpace: spaceUnit,
}

/* ----------------------------------------
 * Dowel Joists
 * ------------------------------------- */

const commonJoistOpts = {
    // dowelRadius: 8.5 / 2,
    dowelRadius: 3.5 / 2,
    dowelCtrDistance: math.inchesToMm(1.25),
    length: 100,
}

const dowelJoistPanelOpts1 = {
    ...commonJoistOpts,
}

const dowelJoistPanelOpts2 = {
    ...commonJoistOpts,
    reinforcementLevel: 2
}

const dowelJoistPanelOpts3 = {
    ...commonJoistOpts,
    dovetailOpt: 'male'
}

const dowelJoistPanelOpts4 = {
    ...commonJoistOpts,
    dovetailOpt: 'female'
}

const dowelJoistPanel1 = dowelJoistPanel(dowelJoistPanelOpts1)[0]
const dowelJoistPanel2 = dowelJoistPanel(dowelJoistPanelOpts2)[0]
const dowelJoistPanel3 = dowelJoistPanel(dowelJoistPanelOpts3)[0]
const dowelJoistPanel4 = dowelJoistPanel(dowelJoistPanelOpts4)[0]

/* ----------------------------------------
 * Dowel Joist Sets
 * ------------------------------------- */

const commonJoistSetOpts = {
    dowelRadius: 3.5 / 2,
    dowelCtrDistance: math.inchesToMm(1.25),
    unitLength: math.inchesToMm(1),
}

const dowelJoistSet1 = dowelJoistSet({
    ...commonJoistSetOpts,
    length: 120,
    numSegments: 1,
})[0]

const dowelJoistSet2 = dowelJoistSet({
    ...commonJoistSetOpts,
    length: 120,
    numSegments: 2,
})[0]

const dowelJoistSet3 = dowelJoistSet({
    ...commonJoistSetOpts,
    length: 180,
    numSegments: 3,
})[0]

const dowelJoistSet4 = dowelJoistSet({
    ...commonJoistSetOpts,
    length: 300,
    numSegments: 5,
})[0]

console.log(dowelJoistSet1)

/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 */
function main() {
    // layout.addToLayout({
    //     name: 'dowelJoistPanel1',
    //     desc: '...',
    //     layoutOpts,
    // }, dowelJoistPanel1);
    // layout.addToLayout({
    //     name: 'dowelJoistPanel2',
    //     desc: '...',
    //     layoutOpts,
    // }, dowelJoistPanel2);
    // layout.addToLayout({
    //     name: 'dowelJoistPanel3',
    //     desc: '...',
    //     layoutOpts,
    // }, dowelJoistPanel3);
    // layout.addToLayout({
    //     name: 'dowelJoistPanel4',
    //     desc: '...',
    //     layoutOpts,
    // }, dowelJoistPanel4);

    // const layoutContent = layout.gridLayout({ layoutOpts });

    // return layoutContent;

    // return [
    //     translate([spaceUnit * 0, spaceUnit * 0, spaceUnit * 0], dowelJoistPanel1),
    //     translate([spaceUnit * 1, spaceUnit * 0, spaceUnit * 0], dowelJoistPanel2),
    //     translate([spaceUnit * 2, spaceUnit * 0, spaceUnit * 0], dowelJoistPanel3),
    //     translate([spaceUnit * 3, spaceUnit * 0, spaceUnit * 0], dowelJoistPanel4),
    // ]

    const joistOuts = dowelJoistSet3.map((dJoistSegment, idx) => {
        return translate([spaceUnit * idx, spaceUnit * 0, spaceUnit * 0], dJoistSegment)
    })

    return joistOuts
}


module.exports = {
    main,
}
