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


//==============================================================================


/* ----------------------------------------
 * Model / Scene Prep
 * ------------------------------------- */

const commonOpts = {
    dowelRadius: 8.5 / 2,
    dowelCtrDistance: math.inchesToMm(1.25),
}


//------------------------------------------------------------------------------

const panelWidth = math.inchesToMm(4)
const panelLength = math.inchesToMm(4)
const panelOffsetTotal = math.inchesToMm(1 / 16)
const panelDowelDiam = 3.25
const panelDowelRadius = panelDowelDiam / 2

const dowelJoistPanelOpts1 = {
    dowelRadius: 3.25 / 2,
    width: 1.25 * 25.4,
}

const dowelJoistPanelOpts2 = {
    dowelRadius: 3.25 / 2,
    width: 1.25 * 25.4,
    reinforcementLevel: 2
}

const dowelJoistPanelOpts3 = {
    dowelRadius: 3.25 / 2,
    width: 1.25 * 25.4,
    dovetailOpt: 'male'
}

const dowelJoistPanelOpts4 = {
    dowelRadius: 3.25 / 2,
    width: 1.25 * 25.4,
    dovetailOpt: 'female'
}

const dowelJoistPanel1 = dowelJoistPanel(dowelJoistPanelOpts1)[0]
const dowelJoistPanel2 = dowelJoistPanel(dowelJoistPanelOpts2)[0]
const dowelJoistPanel3 = dowelJoistPanel(dowelJoistPanelOpts3)[0]
const dowelJoistPanel4 = dowelJoistPanel(dowelJoistPanelOpts4)[0]


const layoutOpts = {
    layoutMargin: math.inchesToMm(2),
    layoutSpace: math.inchesToMm(2),
}


/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 */
function main() {
    layout.addToLayout({
        name: 'dowelJoistPanel1',
        desc: '...',
        layoutOpts,
    }, dowelJoistPanel1);
    layout.addToLayout({
        name: 'dowelJoistPanel2',
        desc: '...',
        layoutOpts,
    }, dowelJoistPanel2);
    layout.addToLayout({
        name: 'dowelJoistPanel3',
        desc: '...',
        layoutOpts,
    }, dowelJoistPanel3);
    layout.addToLayout({
        name: 'dowelJoistPanel4',
        desc: '...',
        layoutOpts,
    }, dowelJoistPanel4);

    const layoutContent = layout.gridLayout({ layoutOpts });

    return layoutContent;

}


module.exports = {
    main,
}
