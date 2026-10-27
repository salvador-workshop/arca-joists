"use strict"

const railFramesInit = ({ jscad, swcadJs }) => {
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

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
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
        console.log('railFramesOpts() -- opts', opts)

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

        console.log('railFramesOpts() -- initOpts', initOpts)

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
        console.log('railFramesProps() -- opts', opts)

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

        console.log('railFramesProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

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
            joistReinforcementLevel,
            interfaceThickness,
            fitGap,
        } = modelProperties.dims

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

        const edgePtLeft = [centreFrameWidth / -2 - dowelDiam, 0, 0]
        const frameLeft = align({
            modes: ['max', 'center', 'center'],
            relativeTo: edgePtLeft
        }, sideJoistWeb)

        const edgePtRight = [centreFrameWidth / 2 + dowelDiam, 0, 0]
        const frameRight = align({
            modes: ['min', 'center', 'center'],
            relativeTo: edgePtRight
        }, sideJoistWeb)

        const frameAssembly = union(
            position.ctr(centreFrame),
            frameLeft,
            frameRight
        )

        const frameAssemblyMeasurement = measureDimensions(frameAssembly)
        const targetFrameWidth = width - (railEdgeOffset * 2)
        console.log(size)
        console.log(frameAssemblyMeasurement)
        console.log(targetFrameWidth)

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

        const bRailFrame = null
        const fittingLine = null

        const sRailFrameAssembly = null

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
