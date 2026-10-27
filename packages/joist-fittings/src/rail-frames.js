"use strict"

const railFramesInit = ({ jscad, swcadJs }) => {
    const {
        cuboid,
    } = jscad.primitives

    const {
        align,
        rotate,
    } = jscad.transforms

    const {
        union,
    } = jscad.booleans

    const { TAU } = jscad.maths.constants

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        componentLine,
        fittings,
        reinforcements,
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

        const dowelHolderWidth = dowelDiam + (interfaceThickness * 2)
        const railEdgeOffset = dowelDiam + interfaceThickness
        const railCentreOffset = dowelCtrDistance + railEdgeOffset
        const centreFrameWidth = width - (railCentreOffset * 2)
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
            dowelDiam,
            dowelHolderWidth,
            railEdgeOffset,
            railCentreOffset,
            centreFrameWidth,
            sideFrameWidth,
            joistWebWidth,
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
        length
    }) => {
        const simDowelHolder = fittings.roundFitting({
            dowelRadius: 3.25 / 2,
            length: math.inchesToMm(5 / 16),
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
        length
    }) => {
        const invDowelHolder = fittings.roundFitting({
            dowelRadius: 3.25 / 2,
            length: math.inchesToMm(5 / 16),
        })[0]

        const dhLine = componentLine({
            endOffset: 0,
            baseLineOffset: 0,
            component: invDowelHolder,
            startPt: [0, 0],
            endPt: [0, length],
            unitLength: math.inchesToMm(1),
        })[1].componentSet

        return dhLine
    }

    const doubleDowelHolderLine = ({
        length
    }) => {
        const dblDowelHolder = fittings.roundFitting({
            dowelRadius: 3.25 / 2,
            length: math.inchesToMm(5 / 16),
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
        } = modelProperties.dims

        const {
            holderEdgePtLeft1,
            holderEdgePtLeft2,
            holderEdgePtRight1,
            holderEdgePtRight2,
        } = modelProperties.points

        const bRailFrame = baseRailFrame(opts)[0]
        const fittingLine = simpleDowelHolderLine({ length: depth })

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
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const joistRailBracket = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const singleRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const doubleRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof joistFittings
     */
    const tripleRailFrame = (opts) => {
        const defaults = railFramesDefaults()
        const initOpts = railFramesOpts(opts)
        const modelProperties = railFramesProps(initOpts)

        const mainModel = cuboid()
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
        joistRailBracket,
        singleRailFrame,
        doubleRailFrame,
        tripleRailFrame,
    }
}

module.exports = {
    init: railFramesInit
}
