"use strict"

const railFramesInit = ({ jscad, swcadJs }) => {
    const {
        cuboid,
    } = jscad.primitives

    const {
        align,
        rotate,
        translate,
    } = jscad.transforms

    const {
        union,
        subtract,
    } = jscad.booleans

    const { TAU } = jscad.maths.constants

    const {
        standards,
        constants,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        componentLine,
        fittings,
        reinforcements,
        boxSupport,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof railFrames
     * @access private
     */
    const railFramesDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                size: [
                    math.inchesToMm(6),
                    math.inchesToMm(4),
                ],
                dowelRadius: 3.25 / 2,
                dowelCtrDistance: math.inchesToMm(1.25),
                dowelHolderLength: math.inchesToMm(5 / 16),
                railBracketDepth: math.inchesToMm(3 / 8),
            },
            points: {
                centrePt: [0, 0, 0]
            },
            types: {
                default: standards.types.TYPE_DEFAULT,
                alt: standards.types.TYPE_ALT,
                simple: { id: 'simple', desc: 'Simple' },
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.types.default.id,
            scale: 1,
            interfaceThickness: standards.INTERFACE_THICKNESS,
            fitGap: standards.FIT_GAP,
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            size: defaultValues.dims.size,
            dowelRadius: defaultValues.dims.dowelRadius,
            dowelCtrDistance: defaultValues.dims.dowelCtrDistance,
            dowelHolderLength: defaultValues.dims.dowelHolderLength,
            railBracketDepth: defaultValues.dims.railBracketDepth,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Initializes options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof railFrames
     * @access private
     */
    const railFramesOpts = (opts) => {
        const defaults = railFramesDefaults()

        // User options
        const {
            size = defaults.opts.size,
            dowelRadius = defaults.opts.dowelRadius,
            dowelCtrDistance = defaults.opts.dowelCtrDistance,
            dowelHolderLength = defaults.opts.dowelHolderLength,
            railBracketDepth = defaults.opts.railBracketDepth,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            size,
            dowelRadius,
            dowelCtrDistance,
            dowelHolderLength,
            railBracketDepth,
            ...stdOpts,
        }


        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof railFrames
     * @access private
     */
    const railFramesProps = (opts) => {
        const defaults = railFramesDefaults()

        const {
            size,
            dowelRadius,
            dowelCtrDistance,
            dowelHolderLength,
            railBracketDepth,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]
        const dowelDiam = dowelRadius * 2

        const railEdgeOffset = dowelDiam + interfaceThickness
        const joistCtrDistanceEdgeOffset = dowelRadius + interfaceThickness
        const joistCtrDistanceOffset = (dowelCtrDistance / 2) + joistCtrDistanceEdgeOffset
        const railCentreOffset = dowelCtrDistance + railEdgeOffset

        const centreFrameWidth = width - (railCentreOffset * 2)
        const joistCtrDistance = width - (joistCtrDistanceOffset * 2)
        const sideFrameWidth = dowelCtrDistance + interfaceThickness

        const joistWebEdgePtLeft = [centreFrameWidth / -2 - dowelDiam, 0, 0]
        const joistWebEdgePtRight = [centreFrameWidth / 2 + dowelDiam, 0, 0]

        const holderEdgeLeftOffset = centreFrameWidth / -2 + interfaceThickness
        const holderEdgePtLeft1 = [holderEdgeLeftOffset, 0, 0]
        const holderEdgePtLeft2 = [holderEdgeLeftOffset - dowelCtrDistance, 0, 0]

        const holderEdgeRightOffset = centreFrameWidth / 2 - interfaceThickness
        const holderEdgePtRight1 = [holderEdgeRightOffset, 0, 0]
        const holderEdgePtRight2 = [holderEdgeRightOffset + dowelCtrDistance, 0, 0]

        const joistWebWidth = dowelCtrDistance - dowelDiam
        const joistReinforcementLevel = 1

        const dowelHolderWidth = dowelDiam + (interfaceThickness * 2)
        const invCutawayHeight = dowelDiam * constants.EQUI_TRIANGLE_HEIGHT_FACTOR

        const joistRailBracketCutawaySize = [
            dowelDiam + interfaceThickness,
            invCutawayHeight + (interfaceThickness / 2),
        ]

        const simpleJoistRailBracketWidth = dowelCtrDistance + dowelDiam + (interfaceThickness * 4)
        const joistRailBracketWidth = width + (interfaceThickness * 2)
        const railBracketHeight = railBracketDepth * constants.PHI_INV

        const bracketGap = dowelHolderWidth * 2.25
        const singleBracketDowelHolderLineDepth = depth - bracketGap - railBracketHeight
        const doubleBracketDowelHolderLineDepth = singleBracketDowelHolderLineDepth - bracketGap - railBracketHeight

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            joistReinforcementLevel,
            type,
            scale,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            depth,
            dowelRadius,
            dowelCtrDistance,
            railBracketDepth,
            railBracketHeight,
            dowelDiam,
            dowelHolderWidth,
            dowelHolderLength,
            railEdgeOffset,
            railCentreOffset,
            centreFrameWidth,
            joistCtrDistance,
            sideFrameWidth,
            joistWebWidth,
            invCutawayHeight,
            joistRailBracketCutawaySize,
            simpleJoistRailBracketWidth,
            joistRailBracketWidth,
            singleBracketDowelHolderLineDepth,
            doubleBracketDowelHolderLineDepth,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centrePt: defaults.vals.points.centrePt,
            joistWebEdgePtLeft,
            joistWebEdgePtRight,
            holderEdgePtLeft1,
            holderEdgePtLeft2,
            holderEdgePtRight1,
            holderEdgePtRight2,
        }

        /** Components used by model */
        const modelComponents = {
        }

        /* ---------------------------------------------
        *  Model Properties
        * ----------------------------------------------
        * Properties accessible to all model functions.
        * --------------------------------------------- */

        const modelProperties = {
            metadata: {
                id: '9999',
                name: 'New Model',
                project: 'New Project',
                author: 'Somebody Somewhere',
                organization: 'Salvador Workshop',
                client: null,
            },
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }


        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    const simpleDowelHolderLine = ({
        length,
        dowelRadius,
        dowelHolderLength,
    }) => {
        const simDowelHolder = fittings.roundFitting({
            dowelRadius,
            length: dowelHolderLength,
        })[0]

        const dhLineBase = componentLine({
            endOffset: 0,
            baseLineOffset: 0,
            component: rotate([0, 0, TAU / 4], simDowelHolder),
            startPt: [0, 0],
            endPt: [0, length],
            unitLength: math.inchesToMm(1),
        })[1].componentSet

        const dhLine = rotate([0, 0, TAU / 4], dhLineBase)

        return dhLine
    }

    const inverseDowelHolderLine = ({
        length,
        dowelRadius,
        dowelHolderLength,
    }) => {
        const invDowelHolder = fittings.inverseRoundFitting({
            dowelRadius,
            length: dowelHolderLength,
        })[0]

        const dhLineBase = componentLine({
            endOffset: 0,
            baseLineOffset: 0,
            component: rotate([0, 0, TAU / 4], invDowelHolder),
            startPt: [0, 0],
            endPt: [0, length],
            unitLength: math.inchesToMm(1),
        })[1].componentSet

        const dhLine = rotate([0, 0, TAU / 4], dhLineBase)

        return dhLine
    }

    const doubleDowelHolderLine = ({
        length,
        dowelRadius,
        dowelHolderLength,
    }) => {
        const dblDowelHolder = fittings.doubleRoundFitting({
            dowelRadius,
            length: dowelHolderLength,
        })[0]

        const dhLine = componentLine({
            endOffset: 0,
            baseLineOffset: 0,
            component: dblDowelHolder,
            startPt: [0, 0],
            endPt: [0, length],
            unitLength: math.inchesToMm(1),
        })[1].componentSet

        return dhLine
    }

    /**
     * Bracket angle support
     * @param {number} supportDepth
     * @param {number} supportHeight
     * @returns Bracket angle support
     */
    const bracketAngleSupport = ({
        supportDepth,
        supportHeight
    }) => {
        let angleSupport = boxSupport.boxSupportQuarter({
            size: [supportDepth, supportHeight],
        })[0]
        angleSupport = rotate([0, TAU / -4, 0], angleSupport)
        return angleSupport
    }

    /**
     * Base rail frame, without any attachments/fittings
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const baseRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const {
            depth,
            centreFrameWidth,
            joistWebWidth,
            joistReinforcementLevel,
            interfaceThickness,
        } = modelProperties.dims

        const {
            joistWebEdgePtLeft,
            joistWebEdgePtRight,
        } = modelProperties.points

        const centreFrame = reinforcements.reinforcedRectPanel({
            size: [
                centreFrameWidth,
                depth,
                interfaceThickness
            ],
            reinforcementThickness: [interfaceThickness, interfaceThickness, interfaceThickness],
            reinforcementPattern: 'full-double'
        })[0]

        const sideJoistWeb = reinforcements.reinforcedJoist({
            length: depth,
            width: joistWebWidth,
            reinforcementLevel: joistReinforcementLevel,
        })[0]

        const frameLeft = align({
            modes: ['max', 'center', 'center'],
            relativeTo: joistWebEdgePtLeft
        }, sideJoistWeb)

        const frameRight = align({
            modes: ['min', 'center', 'center'],
            relativeTo: joistWebEdgePtRight
        }, sideJoistWeb)

        const frameAssembly = union(
            position.ctr(centreFrame),
            frameLeft,
            frameRight
        )

        const mainModel = frameAssembly
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const simpleRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const {
            depth,
            dowelRadius,
            dowelHolderLength,
        } = modelProperties.dims

        const {
            holderEdgePtLeft1,
            holderEdgePtLeft2,
            holderEdgePtRight1,
            holderEdgePtRight2,
        } = modelProperties.points

        const bRailFrame = baseRailFrame(opts)[0]
        const fittingLine = simpleDowelHolderLine({
            length: depth,
            dowelRadius,
            dowelHolderLength,
        })

        const fittingLineLeft1 = align({
            modes: ['max', 'center', 'min'],
            relativeTo: holderEdgePtLeft1
        }, fittingLine)
        const fittingLineLeft2 = align({
            modes: ['max', 'center', 'min'],
            relativeTo: holderEdgePtLeft2
        }, fittingLine)

        const fittingLineRight1 = align({
            modes: ['min', 'center', 'min'],
            relativeTo: holderEdgePtRight1
        }, fittingLine)
        const fittingLineRight2 = align({
            modes: ['min', 'center', 'min'],
            relativeTo: holderEdgePtRight2
        }, fittingLine)

        const sRailFrameAssembly = union(
            position.ctrMin(bRailFrame),
            fittingLineLeft1,
            fittingLineLeft2,
            fittingLineRight1,
            fittingLineRight2,
        )

        const mainModel = sRailFrameAssembly
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Simple joist rail bracket, which fits a single dowel joist
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const simpleJoistRailBracket = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const {
            dowelRadius,
            dowelCtrDistance,
            railBracketDepth,
            railBracketHeight,
            joistRailBracketCutawaySize,
            simpleJoistRailBracketWidth,
            interfaceThickness,
        } = modelProperties.dims

        const bracketSurfaceLip = align(
            { modes: ['center', 'min', 'min'] },
            cuboid({
                size: [
                    simpleJoistRailBracketWidth,
                    interfaceThickness,
                    railBracketDepth,
                ]
            }))
        const bracketSurfaceBase = align(
            { modes: ['center', 'min', 'min'] },
            cuboid({
                size: [
                    simpleJoistRailBracketWidth,
                    railBracketHeight,
                    interfaceThickness,
                ]
            }))
        const bracketBodyBase = union(
            bracketSurfaceLip,
            bracketSurfaceBase
        )

        const bracketCutaway = position.ctrMin(cuboid({
            size: [
                joistRailBracketCutawaySize[0],
                railBracketHeight * 3,
                joistRailBracketCutawaySize[1],
            ]
        }))
        const bracketCutaways = union(
            translate([dowelCtrDistance / -2, 0, 0], bracketCutaway),
            translate([dowelCtrDistance / 2, 0, 0], bracketCutaway)
        )

        const bracketSurface = subtract(
            bracketBodyBase,
            bracketCutaways
        )

        const invDowelHolder = align(
            { modes: ['center', 'min', 'min'] },
            fittings.inverseRoundFitting({
                dowelRadius,
                length: railBracketHeight,
            })[0])
        const holders = union(
            translate([dowelCtrDistance / -2, 0, 0], invDowelHolder),
            translate([dowelCtrDistance / 2, 0, 0], invDowelHolder)
        )

        let angleSupportFull = bracketAngleSupport({
            supportDepth: railBracketDepth,
            supportHeight: railBracketHeight
        })

        angleSupportFull = align({
            modes: ['center', 'min', 'max'],
            relativeTo: [0, 0, railBracketDepth]
        }, angleSupportFull)

        const shortSupportDepth = railBracketDepth - joistRailBracketCutawaySize[1]
        let angleSupportOverHolder = bracketAngleSupport({
            supportDepth: shortSupportDepth,
            supportHeight: railBracketHeight
        })

        angleSupportOverHolder = align({
            modes: ['center', 'min', 'max'],
            relativeTo: [0, 0, railBracketDepth]
        }, angleSupportOverHolder)

        const bracketAssembly = union(
            bracketSurface,
            holders,
            angleSupportFull,
            translate([dowelCtrDistance / -2, 0, 0], angleSupportOverHolder),
            translate([dowelCtrDistance / 2, 0, 0], angleSupportOverHolder),
        )

        const mainModel = bracketAssembly
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Long joist rail bracket, which spans two dowel joists
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const joistRailBracket = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const {
            dowelRadius,
            dowelCtrDistance,
            railBracketDepth,
            railBracketHeight,
            joistRailBracketCutawaySize,
            simpleJoistRailBracketWidth,
            interfaceThickness,
            joistCtrDistance,
            centreFrameWidth,
        } = modelProperties.dims

        const jBracket = align(
            { modes: ['center', 'min', 'min'] },
            simpleJoistRailBracket(opts)[0]
        )

        const leftBracket = translate([joistCtrDistance / -2, 0, 0], jBracket)
        const rightBracket = translate([joistCtrDistance / 2, 0, 0], jBracket)

        const midBracketSurfaceLip = align(
            { modes: ['center', 'min', 'min'] },
            cuboid({
                size: [
                    centreFrameWidth,
                    interfaceThickness,
                    railBracketDepth,
                ]
            }))
        const midBracketSurfaceBase = align(
            { modes: ['center', 'min', 'min'] },
            cuboid({
                size: [
                    centreFrameWidth,
                    railBracketHeight,
                    interfaceThickness,
                ]
            }))
        const midBracketBody = union(
            midBracketSurfaceLip,
            midBracketSurfaceBase
        )

        const bSupportBase = align(
            { modes: ['center', 'min', 'min'] },
            bracketAngleSupport({
                supportDepth: railBracketDepth,
                supportHeight: railBracketHeight
            }))
        const supports = [
            bSupportBase,
            translate([centreFrameWidth / -6, 0, 0], bSupportBase),
            translate([(centreFrameWidth / -6) * 2, 0, 0], bSupportBase),
            translate([centreFrameWidth / 6, 0, 0], bSupportBase),
            translate([(centreFrameWidth / 6) * 2, 0, 0], bSupportBase),
        ]

        const bracketAssembly = union(
            leftBracket,
            midBracketBody,
            rightBracket,
            ...supports,
        )

        const mainModel = bracketAssembly
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Joist rail frame, with one bearing surface
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const singleRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const {
            depth,
            dowelRadius,
            dowelHolderLength,
            singleBracketDowelHolderLineDepth,
        } = modelProperties.dims

        const {
            holderEdgePtLeft1,
            holderEdgePtLeft2,
            holderEdgePtRight1,
            holderEdgePtRight2,
        } = modelProperties.points

        const bRailFrame = align({
            modes: ['center', 'max', 'min']
        }, baseRailFrame(opts)[0])
        const fittingLine = inverseDowelHolderLine({
            length: singleBracketDowelHolderLineDepth,
            dowelRadius,
            dowelHolderLength,
        })

        const fittingLineLeft1 = align({
            modes: ['max', 'max', 'min'],
            relativeTo: holderEdgePtLeft1
        }, fittingLine)
        const fittingLineLeft2 = align({
            modes: ['max', 'max', 'min'],
            relativeTo: holderEdgePtLeft2
        }, fittingLine)

        const fittingLineRight1 = align({
            modes: ['min', 'max', 'min'],
            relativeTo: holderEdgePtRight1
        }, fittingLine)
        const fittingLineRight2 = align({
            modes: ['min', 'max', 'min'],
            relativeTo: holderEdgePtRight2
        }, fittingLine)

        const sRail = joistRailBracket(opts)[0]

        const baseFrame = union(
            bRailFrame,
            fittingLineLeft1,
            fittingLineLeft2,
            fittingLineRight1,
            fittingLineRight2,
        )

        const topRail = align(
            { modes: ['center', 'min', 'min'] },
            sRail
        )

        const sRailFrameAssembly = union(
            align(
                { modes: ['center', 'min', 'min'] },
                baseFrame,
            ),
            topRail,
        )

        const mainModel = position.ctr(sRailFrameAssembly)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Joist rail frame, with two bearing surfaces
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const doubleRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const {
            depth,
            dowelRadius,
            dowelHolderLength,
            doubleBracketDowelHolderLineDepth,
        } = modelProperties.dims

        const {
            holderEdgePtLeft1,
            holderEdgePtLeft2,
            holderEdgePtRight1,
            holderEdgePtRight2,
        } = modelProperties.points

        const bRailFrame = align({
            modes: ['center', 'center', 'min']
        }, baseRailFrame(opts)[0])
        const fittingLine = inverseDowelHolderLine({
            length: doubleBracketDowelHolderLineDepth,
            dowelRadius,
            dowelHolderLength,
        })

        const fittingLineLeft1 = align({
            modes: ['max', 'center', 'min'],
            relativeTo: holderEdgePtLeft1
        }, fittingLine)
        const fittingLineLeft2 = align({
            modes: ['max', 'center', 'min'],
            relativeTo: holderEdgePtLeft2
        }, fittingLine)

        const fittingLineRight1 = align({
            modes: ['min', 'center', 'min'],
            relativeTo: holderEdgePtRight1
        }, fittingLine)
        const fittingLineRight2 = align({
            modes: ['min', 'center', 'min'],
            relativeTo: holderEdgePtRight2
        }, fittingLine)

        const sRail = joistRailBracket(opts)[0]

        const baseFrame = union(
            bRailFrame,
            fittingLineLeft1,
            fittingLineLeft2,
            fittingLineRight1,
            fittingLineRight2,
        )

        const topRail = align(
            {
                modes: ['center', 'min', 'min'],
                relativeTo: [0, depth / -2, 0]
            },
            sRail
        )
        const bottomRail = align(
            {
                modes: ['center', 'max', 'min'],
                relativeTo: [0, depth / 2, 0]
            },
            sRail
        )

        const dRailFrameAssembly = union(
            baseFrame,
            topRail,
            bottomRail,
        )

        const mainModel = position.ctr(dRailFrameAssembly)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: railFramesDefaults,
        props: railFramesProps,
        baseRailFrame,
        simpleRailFrame,
        simpleJoistRailBracket,
        joistRailBracket,
        singleRailFrame,
        doubleRailFrame,
    }
}

module.exports = {
    init: railFramesInit
}
