"use strict"

const dowelJoistPanelInit = ({ jscad, swcadJs }) => {
    const {
        cylinder,
        cuboid,
    } = jscad.primitives

    const {
        align,
        translate,
    } = jscad.transforms

    const {
        subtract,
        union,
        scission
    } = jscad.booleans

    const { hullChain } = jscad.hulls

    const {
        standards,
    } = swcadJs.data

    const {
        math,
    } = swcadJs.calcs

    const {
        fittings,
        reinforcements,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof newModelName
     * @access private
     */
    const dowelJoistPanelDefaults = () => {
        /** Specific value declarations */

        const defaultValues = {
            constants: {
            },
            opts: {
                type: standards.types.TYPE_DEFAULT,
                scale: 1,
                dovetailOpt: 'none',
                reinforcementLevel: 1,
            },
            dims: {
                dowelRadius: 3.25 / 2,
                dowelCtrDistance: math.inchesToMm(1.25),
                length: math.inchesToMm(5.5),
                unitLength: math.inchesToMm(1),
                dowelHolderLength: math.inchesToMm(1 / 4),
                interfaceThickness: standards.INTERFACE_THICKNESS,
                fitGap: standards.FIT_GAP,
            },
            types: {
                default: standards.types.TYPE_DEFAULT,
                alt: standards.types.TYPE_ALT,
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.opts.type,
            scale: defaultValues.opts.scale,
            interfaceThickness: defaultValues.dims.interfaceThickness,
            fitGap: defaultValues.dims.fitGap,
        }

        const defaultOpts = {
            ...standardOpts,
            dowelRadius: defaultValues.dims.dowelRadius,
            dowelCtrDistance: defaultValues.dims.dowelCtrDistance,
            length: defaultValues.dims.length,
            unitLength: defaultValues.dims.unitLength,
            dowelHolderLength: defaultValues.dims.dowelHolderLength,
            reinforcementLevel: defaultValues.opts.reinforcementLevel,
            dovetailOpt: defaultValues.opts.dovetailOpt,
        }


        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    /**
     * Initializes options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof newModelName
     * @access private
     */
    const dowelJoistPanelOpts = (opts) => {
        const defaults = dowelJoistPanelDefaults()
        console.log('dowelJoistPanelOpts() -- opts', opts)

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
            dowelCtrDistance = defaults.opts.dowelCtrDistance,
            length = defaults.opts.length,
            unitLength = defaults.opts.unitLength,
            dowelHolderLength = defaults.opts.dowelHolderLength,
            reinforcementLevel = defaults.opts.reinforcementLevel,
            dovetailOpt = defaults.opts.dovetailOpt,
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
            length,
            unitLength,
            dowelHolderLength,
            reinforcementLevel,
            dovetailOpt,
            ...stdOpts,
        }

        console.log('dowelJoistPanelOpts() -- initOpts', initOpts)

        return initOpts
    }


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof newModelName
     * @access private
     */
    const dowelJoistPanelProps = (opts) => {
        const defaults = dowelJoistPanelDefaults()
        console.log('dowelJoistPanelProps() -- opts', opts)

        const {
            dowelRadius,
            dowelCtrDistance,
            length,
            unitLength,
            dowelHolderLength,
            reinforcementLevel,
            dovetailOpt,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        const dowelDiam = dowelRadius * 2
        const lengthUnits = Math.ceil(length / unitLength)
        const width = interfaceThickness * 2 + dowelCtrDistance + dowelDiam

        const joistWebWidth = width - (dowelDiam * 2) - (interfaceThickness * 2)


        /* ----------------------------------------
         * Base Model Properties, Dimensions
         * ------------------------------------- */

        const modelOpts = {
            type,
            scale,
            dovetailOpt,
            reinforcementLevel,
        }

        const modelConstants = {
        }

        const modelDims = {
            dowelRadius,
            dowelCtrDistance,
            length,
            unitLength,
            dowelHolderLength,
            width,
            dowelDiam,
            joistWebWidth,
            lengthUnits,
            interfaceThickness,
            fitGap,
        }

        const modelPoints = {
            centre: [0, 0, 0]
        }

        const modelProperties = {
            metadata: {
                id: 'P0008',
                name: 'Dowel Joist Panel',
                project: 'SW-2026-Q1',
                author: 'RJ Salvador',
                organization: 'Salvador Workshop',
                client: null,
            },
            opts: modelOpts,
            constants: modelConstants,
            dims: modelDims,
            points: modelPoints,
        }

        console.log('dowelJoistPanelProps() -- modelProperties', modelProperties)

        return modelProperties
    }

    /**
     * Dowel Joist Panel
     * @param {*} opts 
     * @returns `geom3` or `geom3[]`
     * @author R. J. Salvador (Salvador Workshop)
     */
    const dowelJoistPanel = (opts) => {
        const defaults = dowelJoistPanelDefaults()
        const initOpts = dowelJoistPanelOpts(opts)
        const modelProperties = dowelJoistPanelProps(initOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        const holderPair = (modelProps) => {
            const {
                width,
                dowelRadius,
                dowelHolderLength,
            } = modelProps.dims

            let dHolder = fittings.doubleRoundFitting({
                dowelRadius,
                length: dowelHolderLength,
            })[0]

            const holderPairPoints = [
                [width / -2, 0, 0],
                [width / 2, 0, 0],
            ]

            const holder1 = align({
                modes: ['min', 'center', 'min'],
                relativeTo: holderPairPoints[0],
            }, dHolder)
            const holder2 = align({
                modes: ['max', 'center', 'min'],
                relativeTo: holderPairPoints[1],
            }, dHolder)
            const hPair = union(holder1, holder2)

            return hPair
        }


        const holderSet = (modelProps) => {
            const {
                length,
                lengthUnits,
                dowelHolderLength,
            } = modelProps.dims

            const holderPoints = []

            const hUnit = length / (lengthUnits - 1)
            for (let hIdx = 0; hIdx < lengthUnits; hIdx++) {
                let offset = 0
                if (hIdx == 0) {
                    offset = dowelHolderLength / 2
                } else if (hIdx == lengthUnits - 1) {
                    offset = dowelHolderLength / -2
                }
                holderPoints.push([0, hUnit * hIdx + offset])
            }

            const holderPairBase = holderPair(modelProps)

            const holderPairs = holderPoints.map(hPt => {
                return translate([0, hPt[1], 0], holderPairBase)
            })

            const hSet = union(...holderPairs)
            return align({ modes: ['center', 'center', 'min'] }, hSet)
        }


        const interlockingProfiles = (modelProps) => {
            const {
                unitLength,
                interfaceThickness,
                fitGap,
                joistWebWidth,
            } = modelProps.dims

            const dovetailPanelWidth = joistWebWidth
            const dovetailPanelLength = unitLength

            const widthUnit = dovetailPanelWidth / 3
            const lengthUnit = dovetailPanelLength / 3
            const dovetailEndSize = [
                lengthUnit / 6,
                lengthUnit,
            ]

            const widthCoords = [
                widthUnit,
                widthUnit * 2,
            ]
            const lengthCoords = [
                lengthUnit,
                lengthUnit * 2,
            ]

            const dovetailPanelMidpoint = [
                dovetailPanelWidth / 2,
                dovetailPanelLength / 2,
            ]
            const baseProfilePanel = cuboid({
                size: [dovetailPanelWidth, dovetailPanelLength, interfaceThickness],
                center: [dovetailPanelMidpoint[0], dovetailPanelMidpoint[1], 0]
            })
            const lowerPts = [
                [0, lengthCoords[0]],
                [widthCoords[0], lengthCoords[0]],
                [widthCoords[1], lengthCoords[0]],
                [dovetailPanelWidth, lengthCoords[0]],
            ]
            const upperPts = [
                [widthCoords[0] - dovetailEndSize[0], lengthCoords[1]],
                [widthCoords[1] + dovetailEndSize[0], lengthCoords[1]],
            ]

            const allPts = [
                lowerPts[0],
                lowerPts[1],
                ...upperPts,
                lowerPts[2],
                lowerPts[3],
            ]
            let dovetailCutPoints = allPts.map(dtPt => {
                return cylinder({
                    radius: fitGap / 2,
                    height: interfaceThickness * 10,
                    center: [dtPt[0], dtPt[1], 0],
                })
            })

            let dovetailCut = hullChain(dovetailCutPoints)

            const cutPanel = subtract(
                baseProfilePanel,
                dovetailCut
            )
            const panelParts = scission(cutPanel)

            return [
                align({ modes: ['center', 'center', 'center'] }, panelParts[1]),
                align({ modes: ['center', 'center', 'center'] }, panelParts[0]),
            ]
        }


        const framePanel = (modelProps) => {
            const {
                reinforcementLevel,
                dovetailOpt
            } = modelProps.opts

            const {
                length,
                width,
                joistWebWidth,
            } = modelProps.dims

            let joistWebs = reinforcements.reinforcedJoist({
                length,
                width: joistWebWidth,
                reinforcementLevel,
            })[0]
            const hSet = holderSet(modelProperties)

            joistWebs = align({ modes: ['center', 'center', 'min'] }, joistWebs)
            let fPanel = union(
                joistWebs,
                align({ modes: ['center', 'center', 'min'] }, hSet)
            )

            let panelEnds = null

            if (dovetailOpt == 'none') {
                return fPanel
            }

            const fProfile = align({
                modes: ['center', 'max', 'min'],
                relativeTo: [0, length / -2, 0]
            }, interlockProfiles[0])

            const mProfile = align({
                modes: ['center', 'min', 'min'],
                relativeTo: [0, length / 2, 0]
            }, interlockProfiles[1])

            if (dovetailOpt == 'female') {
                panelEnds = fProfile
            }

            if (dovetailOpt == 'male') {
                panelEnds = mProfile
            }

            if (dovetailOpt == 'both') {
                panelEnds = union(
                    fProfile,
                    mProfile,
                )
            }

            fPanel = union(
                fPanel,
                panelEnds
            )

            return fPanel
        }

        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            const fPanel = framePanel(modelProps)

            return fPanel
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let interlockProfiles = interlockingProfiles(modelProperties)
        let hPair = holderPair(modelProperties)
        let hSet = holderSet(modelProperties)

        const mainModel = finalAssembly(modelProperties)

        const modelParts = {
            interlockingProfiles: interlockProfiles,
            holderPair: hPair,
            holderSet: hSet,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return dowelJoistPanel
}

module.exports = {
    init: dowelJoistPanelInit
}