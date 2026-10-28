"use strict"

const angleBracketsInit = ({ jscad, swcadJs }) => {
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
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof angleBrackets
     * @access private
     */
    const angleBracketsDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                dowelRadius: 3.5 / 2,
                dowelCtrDistance: math.inchesToMm(1.25),
                widthToJoistCtr: math.inchesToMm(2.5),
                depthToJoistCtr: math.inchesToMm(2.5),
                height: math.inchesToMm(1 / 8),
                thickness: math.inchesToMm(1 / 8),
            },
            points: {
                centrePt: [0, 0, 0]
            },
            types: {
                default: standards.types.TYPE_DEFAULT,
                alt: standards.types.TYPE_ALT,
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
     * @memberof angleBrackets
     * @access private
     */
    const angleBracketsOpts = (opts) => {
        const defaults = angleBracketsDefaults()
        console.log('angleBracketsOpts() -- opts', opts)

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
            dowelCtrDistance = defaults.opts.dowelCtrDistance,
            widthToJoistCtr = defaults.opts.widthToJoistCtr,
            depthToJoistCtr = defaults.opts.depthToJoistCtr,
            height = defaults.opts.height,
            thickness = defaults.opts.thickness,
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
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            height,
            thickness,
            ...stdOpts,
        }

        console.log('angleBracketsOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof angleBrackets
     * @access private
     */
    const angleBracketsProps = (opts) => {
        const defaults = angleBracketsDefaults()
        console.log('angleBracketsProps() -- opts', opts)

        const {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            height,
            thickness,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const angleSupportGap = interfaceThickness * 2
        const endGap = interfaceThickness
        const offsetJoistCtrToEdge = dowelCtrDistance / 2 + dowelRadius + interfaceThickness
        const offsetJoistCtrToAngSupport = dowelCtrDistance / 2 + dowelRadius + (interfaceThickness * 2)

        const totalWidth = widthToJoistCtr + offsetJoistCtrToEdge
        const totalDepth = depthToJoistCtr + offsetJoistCtrToEdge

        const widthAngleSupport = widthToJoistCtr - offsetJoistCtrToAngSupport
        const depthAngleSupport = depthToJoistCtr - offsetJoistCtrToAngSupport

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
        }

        /** Various dimensions for model */
        const modelDims = {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            height,
            thickness,
            totalWidth,
            totalDepth,
            widthAngleSupport,
            depthAngleSupport,
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

        console.log('angleBracketsProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const rightAngleColumnBracket = (opts) => {
        const defaults = angleBracketsDefaults()
        const initOpts = angleBracketsOpts(opts)
        const modelProperties = angleBracketsProps(initOpts)

        const {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            height,
            thickness,
            totalWidth,
            totalDepth,
            widthAngleSupport,
            depthAngleSupport,
            interfaceThickness,
            fitGap,
        } = modelProperties.dims

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: angleBracketsDefaults,
        props: angleBracketsProps,
        rightAngleColumnBracket,
    }
}

module.exports = {
    init: angleBracketsInit
}
