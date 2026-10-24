"use strict"

const dowelAssemblyFittingsInit = ({ jscad, swcadJs }) => {
    const {
        rectangle,
        triangle,
        sphere,
        cylinderElliptic,
        cuboid,
        polygon,
    } = jscad.primitives

    const {
        align,
        translate,
        rotate,
        mirror,
    } = jscad.transforms

    const {
        subtract,
        union,
        intersect,
    } = jscad.booleans

    const {
        extrudeLinear,
        extrudeRotate,
    } = jscad.extrusions

    const {
        hull,
        hullChain
    } = jscad.hulls

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
        reinforcedRectPanel,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof dowelAssemblyFittings
     * @access private
     */
    const dowelAssemblyFittingsDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                size: [
                    math.inchesToMm(1),
                    math.inchesToMm(1),
                    math.inchesToMm(1),
                ],
                dowelRadius: 3.25 / 2,
                dowelCtrDistance: math.inchesToMm(1.25),
                unitLength: math.inchesToMm(1),
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
            unitLength: defaultValues.dims.unitLength,
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
     * @memberof dowelAssemblyFittings
     * @access private
     */
    const dowelAssemblyFittingsOpts = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        console.log('dowelAssemblyFittingsOpts() -- opts', opts)

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
            dowelCtrDistance = defaults.opts.dowelCtrDistance,
            unitLength = defaults.opts.unitLength,
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
            unitLength,
            ...stdOpts,
        }

        console.log('dowelAssemblyFittingsOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof dowelAssemblyFittings
     * @access private
     */
    const dowelAssemblyFittingsProps = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        console.log('dowelAssemblyFittingsProps() -- opts', opts)

        const {
            dowelRadius,
            dowelCtrDistance,
            unitLength,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts


        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const dowelDiam = dowelRadius * 2
        const dowelEndWidth = dowelCtrDistance + dowelDiam

        const diamToThicknessRatio = 2.737
        const totalJoistThickness = dowelDiam * diamToThicknessRatio
        const totalJoistWidth = 2 * interfaceThickness + dowelEndWidth

        const totalPanelLength = 3 * interfaceThickness + totalJoistWidth

        // ----------------------------------------
        // Geometry

        const flatPanelHeight = interfaceThickness * 3
        const flatPanelSize = [totalPanelLength, totalPanelLength, flatPanelHeight]

        const connectorSupportPtsWidth = totalJoistWidth - interfaceThickness
        const connectorSupportPtsHeight = connectorSupportPtsWidth * constants.EQUI_TRIANGLE_HEIGHT_FACTOR

        const mortiseConnectorSupportPts = [
            [0, connectorSupportPtsHeight / 2],
            [connectorSupportPtsWidth / -2, connectorSupportPtsHeight / -2],
            [connectorSupportPtsWidth / 2, connectorSupportPtsHeight / -2],
        ]

        const halfConnectorSupportPtsWidth = dowelCtrDistance / 2
        const halfConnectorSupportPtsHeight = halfConnectorSupportPtsWidth * constants.EQUI_TRIANGLE_HEIGHT_FACTOR
        const halfConnectorSupportPts = [
            [halfConnectorSupportPtsWidth / -2, halfConnectorSupportPtsHeight],
            [halfConnectorSupportPtsWidth / -2, -halfConnectorSupportPtsHeight],
            [halfConnectorSupportPtsWidth / 2, -halfConnectorSupportPtsHeight],
        ]

        const endConnectorSupportHeight = dowelCtrDistance / 2
        const endConnectorSupportPtsHeight = endConnectorSupportHeight - interfaceThickness
        const endConnectorSupportPtsWidth = endConnectorSupportPtsHeight / constants.TRI_30_FACTOR
        const endConnectorSupportPts = [
            [endConnectorSupportPtsWidth / -2, endConnectorSupportPtsHeight / 2],
            [endConnectorSupportPtsWidth / -2, endConnectorSupportPtsHeight / -2],
            [endConnectorSupportPtsWidth / 2, endConnectorSupportPtsHeight / -2],
        ]

        const bottomGrooveIntersectionPts = [
            [dowelCtrDistance / -2, dowelCtrDistance / 2],
            [dowelCtrDistance / -2, dowelCtrDistance / -2],
            [dowelCtrDistance / 2, dowelCtrDistance / -2],
            [dowelCtrDistance / 2, dowelCtrDistance / 2],
        ]

        // ----------------------------------------
        // Beads, Bits

        const structureBead = cuboid({
            size: [interfaceThickness, interfaceThickness, interfaceThickness],
        })

        const uprightGrooveRadius = dowelRadius + (fitGap / 2)
        const uprightGrooveBit = sphere({ radius: uprightGrooveRadius })

        const bottomGrooveWidth = interfaceThickness / constants.EQUI_TRIANGLE_HEIGHT_FACTOR
        const bottomGrooveCorners = [
            [0, interfaceThickness],
            [bottomGrooveWidth / -2, 0],
            [0, -interfaceThickness],
            [bottomGrooveWidth / 2, 0],
        ]
        const bottomGrooveProfile = polygon({ points: bottomGrooveCorners })
        const bottomGrooveBit = position.ctr(extrudeRotate({ segments: 24 }, bottomGrooveProfile))
        const bottomGrooveInterNodeWidth = 3 * interfaceThickness + bottomGrooveWidth
        const bottomGrooveInterNodeProfile = position.ctr(triangle({ type: 'SSS', values: [bottomGrooveInterNodeWidth, bottomGrooveInterNodeWidth, bottomGrooveInterNodeWidth] }))
        const bottomGrooveIntersectionNode = extrudeRotate({ segments: 24 }, bottomGrooveInterNodeProfile)

        const sideGrooveProfile = bottomGrooveProfile
        const sideGrooveBit = bottomGrooveBit

        const dowelHolderWidth = interfaceThickness * 2 + dowelDiam
        const dowelHolderDepth = interfaceThickness * 3
        const uprightSupportWidth = interfaceThickness * 1.5

        const connectorSupportHeight = flatPanelHeight + totalJoistWidth

        // ----------------------------------------
        // Cutaways

        const endJoistSize = [
            totalJoistThickness + fitGap,
            totalJoistWidth + fitGap,
        ]

        const endSleeveHeight = totalJoistWidth * 0.666667
        const endSleeveCutawaySize = [
            endJoistSize[0],
            endJoistSize[1],
            endSleeveHeight,
        ]
        const endSleeveCutaway = cuboid({
            size: endSleeveCutawaySize,
        })

        const mortiseSleeveHeight = totalJoistWidth + fitGap
        const mortiseSleeveCutawaySize = [
            endJoistSize[0],
            endJoistSize[1] * 1.5,
            mortiseSleeveHeight,
        ]
        const mortiseSleeveCutaway = cuboid({
            size: mortiseSleeveCutawaySize,
        })

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
            dowelDiam,
            dowelEndWidth,
            totalJoistThickness,
            totalJoistWidth,
            totalPanelLength,
            dowelCtrDistance,
            unitLength,
            flatPanelHeight,
            flatPanelSize,
            connectorSupportPtsWidth,
            connectorSupportPtsHeight,
            halfConnectorSupportPtsWidth,
            endConnectorSupportHeight,
            endConnectorSupportPtsHeight,
            endConnectorSupportPtsWidth,
            uprightGrooveRadius,
            bottomGrooveWidth,
            uprightSupportWidth,
            dowelHolderWidth,
            dowelHolderDepth,
            connectorSupportHeight,
            endJoistSize,
            endSleeveHeight,
            endSleeveCutawaySize,
            mortiseSleeveHeight,
            mortiseSleeveCutawaySize,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            mortiseConnectorSupportPts,
            halfConnectorSupportPts,
            endConnectorSupportPts,
            bottomGrooveIntersectionPts,
        }

        /** Components used by model */
        const modelComponents = {
            structureBead,
            uprightGrooveBit,
            bottomGrooveProfile,
            bottomGrooveBit,
            sideGrooveProfile,
            sideGrooveBit,
            bottomGrooveInterNodeProfile,
            bottomGrooveIntersectionNode,
            endSleeveCutaway,
            mortiseSleeveCutaway,
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

        console.log('dowelAssemblyFittingsProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const grooveCutaways = (modelProps) => {
        const {
            dowelCtrDistance,
        } = modelProps.dims

        const {
            uprightGrooveBit,
            bottomGrooveBit,
            sideGrooveBit,
        } = modelProps.components

        const endPts = [
            [-dowelCtrDistance, 0, 0],
            [dowelCtrDistance, 0, 0],
        ]

        const uprightGrooveCutawayPts = endPts.map(endPt => translate(endPt, uprightGrooveBit))
        const uprightGrooveCutawayBase = position.ctr(hull(uprightGrooveCutawayPts))
        const uprightGrooveCutaway = position.ctr(union(
            rotate([0, TAU / 4, 0], uprightGrooveCutawayBase),
            translate(
                [0, dowelCtrDistance, 0],
                rotate([0, TAU / 4, 0], uprightGrooveCutawayBase),
            ),
        ))

        const surfaceGrooveCutaway = position.ctr(union(
            uprightGrooveCutawayBase,
            translate(
                [0, dowelCtrDistance, 0],
                uprightGrooveCutawayBase,
            ),
        ))
        const surfaceGrooveCutawaySet = union(
            surfaceGrooveCutaway,
            rotate([0, 0, TAU / 4], surfaceGrooveCutaway)
        )

        const bottomGrooveCutawayPts = endPts.map(endPt => translate(endPt, bottomGrooveBit))
        const bottomGrooveCutawayBase = position.ctr(hull(bottomGrooveCutawayPts))
        const bottomGrooveCutaway = position.ctr(union(
            bottomGrooveCutawayBase,
            translate([0, dowelCtrDistance, 0], bottomGrooveCutawayBase),
        ))

        const bottomGrooveCutawaySet = union(
            bottomGrooveCutaway,
            rotate([0, 0, TAU / 4], bottomGrooveCutaway)
        )

        const sideGrooveCutawayPts = endPts.map(endPt => translate(endPt, sideGrooveBit))
        const sideGrooveCutawayBase = position.ctr(hull(sideGrooveCutawayPts))
        const sideGrooveCutaway = position.ctr(union(
            sideGrooveCutawayBase,
            translate([0, 0, dowelCtrDistance], sideGrooveCutawayBase),
        ))

        return {
            uprightGrooveCutaway,
            surfaceGrooveCutaway,
            surfaceGrooveCutawaySet,
            bottomGrooveCutaway,
            bottomGrooveCutawaySet,
            sideGrooveCutaway,
        }
    }


    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const flatPanel = (modelProps) => {
        const {
            flatPanelSize,
            interfaceThickness,
        } = modelProps.dims

        const {
            bottomGrooveIntersectionPts,
        } = modelProps.points

        const {
            bottomGrooveIntersectionNode,
        } = modelProps.components

        const fPanel = reinforcedRectPanel({
            size: flatPanelSize,
            reinforcementThickness: [interfaceThickness, interfaceThickness, interfaceThickness],
        })[0]

        const interNodes = bottomGrooveIntersectionPts.map(bottomGrooveIntersectionPt => {
            return position.ctrMin(bottomGrooveIntersectionNode, [bottomGrooveIntersectionPt[0], bottomGrooveIntersectionPt[1], 0])
        })

        let flatPanelAssembly = union(
            position.ctrMin(fPanel),
            interNodes,
        )

        const gCutaways = grooveCutaways(modelProps)

        const sCutaway = align(
            {
                modes: ['center', 'center', 'min'],
                relativeTo: [0, 0, interfaceThickness * 2]
            },
            gCutaways.surfaceGrooveCutawaySet,
        )

        const finalFlatPanel = subtract(
            flatPanelAssembly,
            sCutaway,
        )

        return position.ctrMin(finalFlatPanel)
    }

    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const halfSupport = (modelProps) => {
        const {
            halfConnectorSupportPts,
        } = modelProps.points

        const {
            structureBead,
        } = modelProps.components

        const hConnectorSupportPts = [...halfConnectorSupportPts, halfConnectorSupportPts[0]]
        const hConnectorSupportCorners = hConnectorSupportPts.map(sdfs => translate(sdfs, structureBead))
        const hConnectorSupport = hullChain(hConnectorSupportCorners)

        return position.ctr(
            rotate([TAU / 4, 0, 0], hConnectorSupport)
        )
    }


    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const fullSupport = (modelProps) => {
        const {
            mortiseConnectorSupportPts,
        } = modelProps.points

        const {
            structureBead,
        } = modelProps.components

        const fConnectorSupportPts = [...mortiseConnectorSupportPts, mortiseConnectorSupportPts[0]]
        const fConnectorSupportCorners = fConnectorSupportPts.map(sdfs => translate(sdfs, structureBead))
        const fConnectorSupport = hullChain(fConnectorSupportCorners)

        return position.ctr(
            rotate([TAU / 4, 0, 0], fConnectorSupport)
        )
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const mortiseSleeve = (modelProps) => {
        const {
            totalJoistThickness,
            totalJoistWidth,
            mortiseSleeveHeight,
            mortiseSleeveCutawaySize,
            endJoistSize,
            interfaceThickness,
            fitGap,
        } = modelProps.dims

        const {
            mortiseSleeveCutaway,
        } = modelProps.components

        const sleeveBlankSize = [
            2 * interfaceThickness + endJoistSize[0],
            2 * interfaceThickness + endJoistSize[1],
            mortiseSleeveHeight,
        ]
        const sleeveBlank = position.ctrMin(cuboid({
            size: sleeveBlankSize,
        }))

        const sleeveCutaway = position.ctrMin(mortiseSleeveCutaway, [0, 0, interfaceThickness * 1.25])

        const extraCutawayRadius = [
            (totalJoistWidth - (interfaceThickness * 3)) / 2,
            mortiseSleeveHeight,
        ]
        const extraCutawayBase = cylinderElliptic({
            height: totalJoistWidth * 2,
            startRadius: extraCutawayRadius,
            endRadius: extraCutawayRadius,
            segments: 16,
        })
        const extraCutaway = position.ctrMin(
            rotate([TAU / 4, TAU / 2, TAU / 4], extraCutawayBase),
            [0, 0, interfaceThickness * 6]
        )

        const cutMortise = subtract(
            sleeveBlank,
            sleeveCutaway,
            extraCutaway,
        )

        return cutMortise
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const endCapSleeve = (modelProps) => {
        const {
            totalJoistThickness,
            totalJoistWidth,
            endSleeveHeight,
            endSleeveCutawaySize,
            endJoistSize,
            interfaceThickness,
            fitGap,
        } = modelProps.dims

        const {
            endSleeveCutaway,
        } = modelProps.components

        const sleeveBlankSize = [
            2 * interfaceThickness + endJoistSize[0],
            2 * interfaceThickness + endJoistSize[1],
            endSleeveHeight,
        ]
        const sleeveBlank = position.ctrMin(cuboid({
            size: sleeveBlankSize,
        }))


        const sleeveCutaway = position.ctrMin(endSleeveCutaway, [0, 0, interfaceThickness * 1.25])

        const extraCutawayRadius = [
            (totalJoistWidth - (interfaceThickness * 2)) / 2,
            endSleeveHeight,
        ]
        const extraCutawayBase = cylinderElliptic({
            height: totalJoistWidth * 2,
            startRadius: extraCutawayRadius,
            endRadius: extraCutawayRadius,
            segments: 16,
        })
        const extraCutaway = position.ctrMin(
            rotate([TAU / 4, TAU / 2, TAU / 4], extraCutawayBase),
            [0, 0, interfaceThickness * 3]
        )

        const cutEndConnector = subtract(
            sleeveBlank,
            sleeveCutaway,
            extraCutaway,
        )

        return cutEndConnector
    }


    //------------------------------------------------------------------------------





    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const uprightDowelHolder = (modelProps, isTop = false) => {
        const {
            dowelDiam,
            interfaceThickness,
            dowelHolderWidth,
            dowelHolderDepth,
            flatPanelHeight,
        } = modelProps.dims

        const transitionWidth = (dowelHolderWidth - interfaceThickness) / 2
        const transitionHeight = transitionWidth * constants.TRI_30_FACTOR

        const dowelHolderMargin = isTop ? 0 : flatPanelHeight
        const dowelHolderHeight = dowelHolderWidth + transitionHeight + dowelHolderMargin

        const transitionBeadPts = [
            [0, -transitionHeight],
            [transitionWidth, 0],
            [0, transitionHeight],
            [-transitionWidth, 0],
        ]
        const transitionBeadProfile = position.ctr(polygon({ points: transitionBeadPts }))
        const dowelHolderBaseProfileWide = rectangle({ size: [dowelHolderWidth, dowelHolderHeight] })
        const dowelHolderBaseProfileNarrow = rectangle({ size: [dowelHolderDepth, dowelHolderHeight] })

        let cutProfileWide = null
        let cutProfileNarrow = null
        const topCornersWide = [
            [dowelHolderWidth / -2, dowelHolderHeight / 2],
            [dowelHolderWidth / 2, dowelHolderHeight / 2],
        ]
        const bottomCornersWide = [
            [dowelHolderWidth / -2, dowelHolderHeight / -2],
            [dowelHolderWidth / 2, dowelHolderHeight / -2],
        ]
        const topCornersNarrow = [
            [dowelHolderDepth / -2, dowelHolderHeight / 2],
            [dowelHolderDepth / 2, dowelHolderHeight / 2],
        ]
        const bottomCornersNarrow = [
            [dowelHolderDepth / -2, dowelHolderHeight / -2],
            [dowelHolderDepth / 2, dowelHolderHeight / -2],
        ]

        if (isTop) {
            cutProfileWide = subtract(
                dowelHolderBaseProfileWide,
                translate(bottomCornersWide[0], transitionBeadProfile),
                translate(bottomCornersWide[1], transitionBeadProfile),
            )
            cutProfileNarrow = subtract(
                dowelHolderBaseProfileNarrow,
                translate(bottomCornersNarrow[0], transitionBeadProfile),
                translate(bottomCornersNarrow[1], transitionBeadProfile),
            )
        } else {
            cutProfileWide = subtract(
                dowelHolderBaseProfileWide,
                translate(topCornersWide[0], transitionBeadProfile),
                translate(topCornersWide[1], transitionBeadProfile),
            )
            cutProfileNarrow = subtract(
                dowelHolderBaseProfileNarrow,
                translate(topCornersNarrow[0], transitionBeadProfile),
                translate(topCornersNarrow[1], transitionBeadProfile),
            )
        }

        const holderProfileWideBase = extrudeLinear({ height: dowelHolderDepth }, cutProfileWide)
        const holderProfileWide = position.ctr(rotate([TAU / 4, 0, 0], holderProfileWideBase))

        const holderProfileNarrowBase = extrudeLinear({ height: dowelHolderWidth }, cutProfileNarrow)
        const holderProfileNarrow = position.ctr(rotate([TAU / 4, 0, TAU / 4], holderProfileNarrowBase))

        const holderBase = intersect(
            holderProfileWide,
            holderProfileNarrow,
        )

        return holderBase
    }

    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const uprightDowelLine = (modelProps) => {
        const {
            interfaceThickness,
            connectorSupportHeight,
            uprightSupportWidth,
            dowelHolderWidth
        } = modelProps.dims

        const supportWidthFromHolder = dowelHolderWidth * 0.4
        const supportCoreWidth = Math.max(supportWidthFromHolder, uprightSupportWidth)

        const supportCore = cuboid({
            size: [
                supportCoreWidth,
                interfaceThickness,
                connectorSupportHeight,
            ]
        })
        const topUprightHolder = align(
            {
                modes: ['center', 'center', 'max'],
                relativeTo: [0, 0, connectorSupportHeight / 2],
            },
            uprightDowelHolder(modelProps, true),
        )
        const bottomUprightHolder = align(
            {
                modes: ['center', 'center', 'min'],
                relativeTo: [0, 0, connectorSupportHeight / -2],
            },
            uprightDowelHolder(modelProps, false),
        )

        const dowelLine = union(
            supportCore,
            topUprightHolder,
            bottomUprightHolder,
        )

        return dowelLine
    }


    /**
     * ...
     * @param {*} opts 
     * @returns ...
     * @memberof dowelAssemblyFittings
     */
    const uprightPanel = (modelProps) => {
        const {
            dowelCtrDistance,
            interfaceThickness,
            connectorSupportHeight,
            flatPanelHeight,
            fitGap
        } = modelProps.dims

        let midSupportBlank = cuboid({
            size: [
                interfaceThickness * 1.25,
                interfaceThickness * 3,
                connectorSupportHeight,
            ]
        })
        midSupportBlank = align(
            { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0] },
            midSupportBlank,
        )

        const uprightDowelHolderLine = position.ctrMin(uprightDowelLine(modelProps), [0, 0, 0])
        const dHolder1 = translate([dowelCtrDistance / -2, 0, 0], uprightDowelHolderLine)
        const dHolder2 = translate([dowelCtrDistance / 2, 0, 0], uprightDowelHolderLine)

        const hSupport1 = align(
            {
                modes: ['min', 'center', 'min'],
                relativeTo: [
                    (dowelCtrDistance + (interfaceThickness * 0.5)) / -2,
                    0,
                    0,
                ],
            },
            halfSupport(modelProps)
        )
        const hSupport2 = mirror({ normal: [1, 0, 0] }, hSupport1)

        const fSupport = align(
            { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0] },
            fullSupport(modelProps)
        )

        const blankPanel = union(
            fSupport,
            hSupport1,
            hSupport2,
            dHolder1,
            dHolder2,
            midSupportBlank,
        )

        const gCutaways = grooveCutaways(modelProps)

        const bPanel = align(
            {
                modes: ['center', 'min', 'center'],
                relativeTo: [0, 0, 0],
            },
            blankPanel,
        )
        const uCutaway = align(
            {
                modes: ['center', 'max', 'center'],
                relativeTo: [0, interfaceThickness, 0],
            },
            rotate([0, 0, TAU / 4], gCutaways.uprightGrooveCutaway),
        )
        const sCutaway = align(
            {
                modes: ['center', 'center', 'center'],
                relativeTo: [0, 0, flatPanelHeight / 2 + fitGap],
            },
            gCutaways.sideGrooveCutaway,
        )

        const cutPanel = subtract(
            bPanel,
            uCutaway,
            mirror({ normal: [0, 1, 0], origin: [0, interfaceThickness * 1.5, 0] }, uCutaway),
            sCutaway,
            translate([0, interfaceThickness * 3, 0], sCutaway),
        )

        const mainModel = cutPanel

        return mainModel
    }


    //------------------------------------------------------------------------------


    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const angleConnector = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        const initOpts = dowelAssemblyFittingsOpts(opts)
        const modelProperties = dowelAssemblyFittingsProps(initOpts)

        const {
            totalPanelLength,
        } = modelProperties.dims

        const fPanel = position.ctrMin(flatPanel(modelProperties))

        const uPanel = uprightPanel(modelProperties)
        const uPanelAdj = align({
            modes: ['center', 'max', 'min'],
            relativeTo: [0, totalPanelLength / -2, 0],
        }, uPanel)

        const angleConnectorBlank = union(
            fPanel,
            uPanelAdj,
        )

        const gCutaways = grooveCutaways(modelProperties)
        const angleConnectorCut = subtract(
            angleConnectorBlank,
            gCutaways.bottomGrooveCutawaySet
        )

        const mainModel = angleConnectorCut

        const modelParts = {
            flatPanel: fPanel,
            uprightPanel: uPanel,
        }

        return [mainModel, modelParts, modelProperties]
    }


    /**
     * New Model 2
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const angleCornerConnector = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        const initOpts = dowelAssemblyFittingsOpts(opts)
        const modelProperties = dowelAssemblyFittingsProps(initOpts)

        const {
            interfaceThickness,
            totalPanelLength,
        } = modelProperties.dims

        const fPanel = position.ctrMin(flatPanel(modelProperties))

        const uPanel = uprightPanel(modelProperties)
        const uPanelAdj = align({
            modes: ['center', 'max', 'min'],
            relativeTo: [0, totalPanelLength / -2, 0],
        }, uPanel)
        const uPanelExtra = align({
            modes: ['max', 'center', 'min'],
            relativeTo: [
                totalPanelLength / -2,
                0,
                0,
            ],
        }, rotate([0, 0, TAU / -4], uPanel))

        const angleCornerConnectorBlank = union(
            fPanel,
            uPanelAdj,
            uPanelExtra,
        )

        const gCutaways = grooveCutaways(modelProperties)
        const angleCornerConnectorCut = subtract(
            angleCornerConnectorBlank,
            gCutaways.bottomGrooveCutawaySet
        )

        const mainModel = angleCornerConnectorCut

        const modelParts = {
            flatPanel: fPanel,
            uprightPanel: uPanel,
        }

        return [mainModel, modelParts, modelProperties]
    }


    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const flatConnector = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        const initOpts = dowelAssemblyFittingsOpts(opts)
        const modelProperties = dowelAssemblyFittingsProps(initOpts)

        const fPanel = position.ctrMin(flatPanel(modelProperties))
        const fConnector = fPanel

        const gCutaways = grooveCutaways(modelProperties)
        const fConnectorCut = subtract(
            fConnector,
            gCutaways.bottomGrooveCutawaySet
        )

        const mainModel = fConnectorCut

        const modelParts = {
            flatPanel: fPanel,
        }

        return [mainModel, modelParts, modelProperties]
    }


    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const mortiseConnector = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        const initOpts = dowelAssemblyFittingsOpts(opts)
        const modelProperties = dowelAssemblyFittingsProps(initOpts)

        const {
            interfaceThickness,
        } = modelProperties.dims

        const {
            mortiseSleeveCutaway,
        } = modelProperties.components

        const fPanel = position.ctrMin(flatPanel(modelProperties))
        const mSleeve = mortiseSleeve(modelProperties)
        const sleeveCutaway = position.ctrMin(mortiseSleeveCutaway, [0, 0, interfaceThickness * 1.25])

        const mortiseConnectorBlank = union(
            fPanel,
            mSleeve,
        )

        let cutMortiseConnector = subtract(
            mortiseConnectorBlank,
            sleeveCutaway,
        )

        const gCutaways = grooveCutaways(modelProperties)
        cutMortiseConnector = subtract(
            cutMortiseConnector,
            gCutaways.bottomGrooveCutawaySet
        )

        const mainModel = cutMortiseConnector
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }


    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof dowelAssemblyFittings
     */
    const endConnector = (opts) => {
        const defaults = dowelAssemblyFittingsDefaults()
        const initOpts = dowelAssemblyFittingsOpts(opts)
        const modelProperties = dowelAssemblyFittingsProps(initOpts)

        const {
            interfaceThickness,
        } = modelProperties.dims

        const {
            endSleeveCutaway,
        } = modelProperties.components

        const fPanel = position.ctrMin(flatPanel(modelProperties))
        const endSleeve = endCapSleeve(modelProperties)
        const sleeveCutaway = position.ctrMin(endSleeveCutaway, [0, 0, interfaceThickness * 1.25])

        const endConnectorBlank = union(
            fPanel,
            endSleeve,
        )

        let cutEndConnector = subtract(
            endConnectorBlank,
            sleeveCutaway,
        )

        const gCutaways = grooveCutaways(modelProperties)
        cutEndConnector = subtract(
            cutEndConnector,
            gCutaways.bottomGrooveCutawaySet
        )

        const mainModel = cutEndConnector
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }


    return {
        defaults: dowelAssemblyFittingsDefaults,
        props: dowelAssemblyFittingsProps,
        angleConnector,
        angleCornerConnector,
        flatConnector,
        mortiseConnector,
        endConnector,
    }
}

module.exports = {
    init: dowelAssemblyFittingsInit
}
