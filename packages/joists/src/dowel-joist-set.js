"use strict"

const dowelJoistPanelModule = require('./dowel-joist-panel')

const dowelJoistSetInit = ({ jscad, swcadJs }) => {
    const {
        standards,
    } = swcadJs.data

    const {
        math,
    } = swcadJs.calcs

    const dowelJoistPanel = dowelJoistPanelModule.init({ jscad, swcadJs })


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof dowelJoistSet
     * @access private
     */
    const dowelJoistSetDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                dowelHolderTypes: ['single', 'inverse', 'double']
            },
            opts: {
                reinforcementLevel: 1,
                dowelHolderType: 'double',
                numSegments: 2,
                type: standards.types.TYPE_DEFAULT,
                scale: 1,
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
            type: defaultValues.opts.type,
            scale: defaultValues.opts.scale,
            interfaceThickness: defaultValues.dims.interfaceThickness,
            fitGap: defaultValues.dims.fitGap,
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            dowelRadius: defaultValues.dims.dowelRadius,
            dowelCtrDistance: defaultValues.dims.dowelCtrDistance,
            length: defaultValues.dims.length,
            unitLength: defaultValues.dims.unitLength,
            dowelHolderLength: defaultValues.dims.dowelHolderLength,
            numSegments: defaultValues.opts.numSegments,
            reinforcementLevel: defaultValues.opts.reinforcementLevel,
            dowelHolderType: defaultValues.opts.dowelHolderType,
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
     * @memberof dowelJoistSet
     * @access private
     */
    const dowelJoistSetOpts = (opts) => {
        const defaults = dowelJoistSetDefaults()
        console.log('dowelJoistSetOpts() -- opts', opts)

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
            dowelCtrDistance = defaults.opts.dowelCtrDistance,
            length = defaults.opts.length,
            unitLength = defaults.opts.unitLength,
            dowelHolderLength = defaults.opts.dowelHolderLength,
            numSegments = defaults.opts.numSegments,
            reinforcementLevel = defaults.opts.reinforcementLevel,
            dowelHolderType = defaults.opts.dowelHolderType,
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
            numSegments,
            reinforcementLevel,
            dowelHolderType,
            ...stdOpts,
        }

        console.log('dowelJoistSetOpts() -- initOpts', initOpts)

        return initOpts
    }

    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof dowelJoistSet
     * @access private
     */
    const dowelJoistSetProps = (opts) => {
        const defaults = dowelJoistSetDefaults()
        console.log('dowelJoistSetProps() -- opts', opts)

        const {
            dowelRadius,
            dowelCtrDistance,
            length,
            unitLength,
            dowelHolderLength,
            numSegments,
            reinforcementLevel,
            dowelHolderType,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const numMidSegments = numSegments > 2 ? numSegments - 2 : 0
        const segmentLength = length / numSegments
        const segmentConnectorOffset = unitLength / 2
        const segmentDims = []

        if (numMidSegments == 0) {
            // no middle segments
            if (numSegments == 2) {
                segmentDims.push({
                    length: segmentLength - segmentConnectorOffset,
                    dovetailOpt: 'male'
                })
                segmentDims.push({
                    length: segmentLength - segmentConnectorOffset,
                    dovetailOpt: 'female'
                })
            } else {
                // only one segment. Just pass params to base component.
                segmentDims.push({
                    length,
                    dovetailOpt: 'none'
                })
            }
        } else {
            // we have middle segments
            const firstSegmentDims = {
                length: segmentLength - segmentConnectorOffset,
                dovetailOpt: 'male'
            }
            const lastSegmentDims = {
                length: segmentLength - segmentConnectorOffset,
                dovetailOpt: 'female'
            }
            const midSegmentDims = {
                length: segmentLength - (segmentConnectorOffset * 2),
                dovetailOpt: 'both'
            }

            segmentDims.push(firstSegmentDims)
            for (let segmentIdx = 0; segmentIdx < numMidSegments; segmentIdx++) {
                segmentDims.push(midSegmentDims)
            }
            segmentDims.push(lastSegmentDims)
        }


        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            numSegments,
            reinforcementLevel,
            dowelHolderType,
            type,
            scale,
        }

        /** Various dimensions for model */
        const modelDims = {
            dowelRadius,
            dowelCtrDistance,
            length,
            unitLength,
            dowelHolderLength,
            numSegments,
            numMidSegments,
            segmentLength,
            segmentConnectorOffset,
            segmentDims,
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

        console.log('dowelJoistSetProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * New Model
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const dowelJoistSet = (opts) => {
        const defaults = dowelJoistSetDefaults()
        const initOpts = dowelJoistSetOpts(opts)
        const modelProperties = dowelJoistSetProps(initOpts)

        const {
            dowelRadius,
            dowelCtrDistance,
            unitLength,
            dowelHolderLength,
            segmentDims,
        } = modelProperties.dims

        const {
            reinforcementLevel,
            dowelHolderType,
        } = modelProperties.opts

        const commonDowelJoistPanelOpts = {
            dowelRadius,
            dowelCtrDistance,
            unitLength,
            dowelHolderLength,
            reinforcementLevel,
            dowelHolderType,
        }

        const segments = segmentDims.map(segmentDimSet => {
            const dJoistPanelOpts = {
                ...commonDowelJoistPanelOpts,
                length: segmentDimSet.length,
                dovetailOpt: segmentDimSet.dovetailOpt,
            }
            return dowelJoistPanel(dJoistPanelOpts)[0]
        })

        let mainModel = segments

        let modelParts = {
            segments
        }

        return [mainModel, modelParts, modelProperties]
    }

    return dowelJoistSet
}

module.exports = {
    init: dowelJoistSetInit
}
