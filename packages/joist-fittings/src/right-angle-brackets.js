"use strict"

const angleBracketsInit = ({ jscad, swcadJs }) => {
    const {
        cylinder,
        cuboid,
    } = jscad.primitives

    const {
        align,
        translate,
        rotate,
    } = jscad.transforms

    const {
        subtract,
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
            constants: {
                orientations: ['external', 'internal']
            },
            opts: {
                orientation: 'internal'
            },
            dims: {
                dowelRadius: 3.5 / 2,
                dowelCtrDistance: math.inchesToMm(1.25),
                widthToJoistCtr: math.inchesToMm(1.5),
                depthToJoistCtr: math.inchesToMm(1.5),
                widthBetweenJoistCtrs: math.inchesToMm(3),
                height: math.inchesToMm(1 / 8),
                thickness: math.inchesToMm(5 / 32),
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
            dowelRadius: defaultValues.dims.dowelRadius,
            dowelCtrDistance: defaultValues.dims.dowelCtrDistance,
            widthToJoistCtr: defaultValues.dims.widthToJoistCtr,
            depthToJoistCtr: defaultValues.dims.depthToJoistCtr,
            widthBetweenJoistCtrs: defaultValues.dims.widthBetweenJoistCtrs,
            height: defaultValues.dims.height,
            thickness: defaultValues.dims.thickness,
            orientation: defaultValues.opts.orientation,
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

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
            dowelCtrDistance = defaults.opts.dowelCtrDistance,
            widthToJoistCtr = defaults.opts.widthToJoistCtr,
            depthToJoistCtr = defaults.opts.depthToJoistCtr,
            widthBetweenJoistCtrs = defaults.opts.widthBetweenJoistCtrs,
            height = defaults.opts.height,
            thickness = defaults.opts.thickness,
            orientation = defaults.opts.orientation,
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
            widthBetweenJoistCtrs,
            height,
            thickness,
            orientation,
            ...stdOpts,
        }


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

        const {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            widthBetweenJoistCtrs,
            height,
            thickness,
            orientation,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const dowelCutawayRadius = dowelRadius + (fitGap / 2)

        const angleSupportGap = interfaceThickness * 2
        const endGap = interfaceThickness
        const offsetJoistCtrToEdge = dowelCtrDistance / 2 + dowelRadius + interfaceThickness
        const offsetJoistCtrToAngSupport = dowelCtrDistance / 2 + dowelRadius + (interfaceThickness * 2)

        const totalWidthInt = widthToJoistCtr + offsetJoistCtrToEdge
        const totalDepthInt = depthToJoistCtr + offsetJoistCtrToEdge
        const widthIntCutaway = totalWidthInt - thickness
        const depthIntCutaway = totalDepthInt - thickness

        const totalWidthExt = totalWidthInt + thickness
        const totalDepthExt = totalDepthInt + thickness
        const widthExtCutaway = totalWidthInt
        const depthExtCutaway = totalDepthInt

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
            orientations: defaults.vals.constants.orientations
        }

        /** Derived user options for the model */
        const modelOpts = {
            orientation,
            type,
            scale,
        }

        /** Various dimensions for model */
        const modelDims = {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            widthBetweenJoistCtrs,
            height,
            thickness,
            dowelCutawayRadius,
            totalWidthInt,
            totalDepthInt,
            widthIntCutaway,
            depthIntCutaway,
            totalWidthExt,
            totalDepthExt,
            widthExtCutaway,
            depthExtCutaway,
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
            orientation,
        } = modelProperties.opts

        const {
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            height,
            thickness,
            dowelCutawayRadius,
            totalWidthInt,
            totalDepthInt,
            widthIntCutaway,
            depthIntCutaway,
            totalWidthExt,
            totalDepthExt,
            widthExtCutaway,
            depthExtCutaway,
        } = modelProperties.dims

        const blankSize = [
            orientation == 'internal' ? totalWidthInt : totalWidthExt,
            orientation == 'internal' ? totalDepthInt : totalDepthExt,
            height,
        ]

        const cutawaySize = [
            orientation == 'internal' ? widthIntCutaway : widthExtCutaway,
            orientation == 'internal' ? depthIntCutaway : depthExtCutaway,
            height,
        ]

        const bracketBodyBlank = cuboid({ size: blankSize })
        const bracketBodyCutaway = cuboid({ size: cutawaySize })
        let bracketBodyBase = subtract(
            align({ modes: ['max', 'max', 'center'] }, bracketBodyBlank),
            align({ modes: ['max', 'max', 'center'] }, bracketBodyCutaway)
        )

        const bracketBaseAlignmentPt = orientation == 'internal' ? [0, 0, 0] : [-thickness, -thickness, 0]
        bracketBodyBase = align({
            modes: ['min', 'min', 'center'],
            relativeTo: bracketBaseAlignmentPt,
        }, bracketBodyBase)

        const joistDowelCutawayBase = cylinder({
            radius: dowelCutawayRadius,
            height: height * 1.5
        })
        const joistDowelCutawayPair = position.ctr(
            union(
                joistDowelCutawayBase,
                translate([dowelCtrDistance, 0, 0], joistDowelCutawayBase)
            )
        )
        const jDowelCutawayPairX = translate([widthToJoistCtr, 0, 0], joistDowelCutawayPair)
        const jDowelCutawayPairY = translate(
            [0, depthToJoistCtr, 0],
            rotate([0, 0, TAU / 4], joistDowelCutawayPair)
        )

        const joistDowelCutaways = union(
            jDowelCutawayPairX,
            jDowelCutawayPairY,
        )

        const bracketAssembly = subtract(
            bracketBodyBase,
            joistDowelCutaways,
        )

        const mainModel = bracketAssembly
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const straightColumnBracket = (opts) => {
        const defaults = angleBracketsDefaults()
        const initOpts = angleBracketsOpts(opts)
        const modelProperties = angleBracketsProps(initOpts)

        const {
            orientation,
        } = modelProperties.opts

        const {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            widthBetweenJoistCtrs,
            height,
            thickness,
            dowelCutawayRadius,
            totalWidthInt,
            totalDepthInt,
            widthIntCutaway,
            depthIntCutaway,
            totalWidthExt,
            totalDepthExt,
            widthExtCutaway,
            depthExtCutaway,
            interfaceThickness,
            fitGap,
        } = modelProperties.dims

        const bracketBodyBlank = null
        const bracketBodyCutaway = null
        const bracketBodyBase = null

        const joistDowelCutawayBase = null
        const joistDowelCutaways = null

        const bracketAssembly = null

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const teeColumnBracket = (opts) => {
        const defaults = angleBracketsDefaults()
        const initOpts = angleBracketsOpts(opts)
        const modelProperties = angleBracketsProps(initOpts)

        const {
            orientation,
        } = modelProperties.opts

        const {
            dowelRadius,
            dowelCtrDistance,
            widthToJoistCtr,
            depthToJoistCtr,
            widthBetweenJoistCtrs,
            height,
            thickness,
            dowelCutawayRadius,
            totalWidthInt,
            totalDepthInt,
            widthIntCutaway,
            depthIntCutaway,
            totalWidthExt,
            totalDepthExt,
            widthExtCutaway,
            depthExtCutaway,
            interfaceThickness,
            fitGap,
        } = modelProperties.dims

        const bracketBodyBlank = null
        const bracketBodyCutaway = null
        const bracketBodyBase = null

        const joistDowelCutawayBase = null
        const joistDowelCutaways = null

        const bracketAssembly = null

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
        straightColumnBracket,
        teeColumnBracket,
    }
}

module.exports = {
    init: angleBracketsInit
}
