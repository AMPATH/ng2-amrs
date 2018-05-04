import { BasePatientListGen } from 'ampath-json-query-gen';
import { Json2Sql } from 'ampath-json2sql';
import { Promise } from 'bluebird';
import { BaseMysqlReport } from './base-mysql.report';

export class PatientlistMysqlReport extends BaseMysqlReport {
    constructor(reportName, params) {
        super(reportName, params);
    }

    generatePatientListReport(indicators) {
        // 1. Fetch report schema
        // 2. Determine the aggregate, base
        // 3. Fetch the template report
        // 4. Generate patient list json query
        // 5. Generate report sql using json2sql
        // 6. Execute sql statement using sql generator

        const that = this;
        return new Promise((resolve, error) => {
            // fetch reports
            that.fetchReportSchema(that.reportName)
                .then((reportSchemas) => {
                    that.reportSchemas = reportSchemas;
                    // consolidate params and indicators
                    indicators = that.consolidateParamsAndIndicators(that.params, indicators);
                   
                    // determine patient list seed schemas
                    let aggs = this.determineBaseAndAggrSchema(that.reportSchemas, indicators);
                    if (aggs.length > 0) {
                        // console.log('Potential schemas with supplied indicators', aggs.length);
                        that.plSchemasRaw = this.determineBaseAndAggrSchema(that.reportSchemas, indicators)[0];
                    }
                    if (that.plSchemasRaw && that.plSchemasRaw.aggregate && that.plSchemasRaw.base) {
                        that.fetchPatientListTemplate(that.plSchemasRaw.aggregate)
                            .then((template) => {
                                that.plTemplate = template.main;

                                

                                let generated =
                                    that.generatePatientListJsonQuery(that.plSchemasRaw.aggregate, that.plSchemasRaw.base, that.plTemplate, that.params);
                                    
                                // console.log('GENERATED', generated.generated.filters, that.params);
                                // if (this.hasEmptyDynamicExpressions(generated) && aggs.length > 1) {
                                //     for (let i = 1; i < aggs.length; i++) {
                                //         that.plSchemasRaw = this.determineBaseAndAggrSchema(that.reportSchemas, indicators)[i];
                                //         generated =
                                //             that.generatePatientListJsonQuery(that.plSchemasRaw.aggregate, that.plSchemasRaw.base,
                                //                 that.plTemplate, that.params);
                                //         if (!this.hasEmptyDynamicExpressions(generated)) {
                                //             break;
                                //         }
                                //     }
        
                                // }

                               // let aggregateDatasets = that.fetchReportSchema(that.reportSchemas);
                                that.generatedPL = {
                                    main: generated.generated
                                };
                                let combined = Object.assign(that.reportSchemas,that.generatedPL)
                                that.modifiedParam = generated.params;
                                // generate query
                                that.generateReportQuery(combined, that.modifiedParam)
                                    .then((sqlQuery) => {
                                        //allow 'null' as parameter value
                                        sqlQuery=sqlQuery.replace(/\'null\'/g,"null");
                                        that.reportQuery = sqlQuery;
                                        // run query
                                        that.executeReportQuery(that.reportQuery)
                                            .then((results) => {
                                                that.queryResults = results;

                                                resolve({
                                                    schemas: that.reportSchemas,
                                                    generatedSchemas: that.generatedPL,
                                                    sqlQuery: that.reportQuery,
                                                    results: that.queryResults
                                                });
                                            })
                                            .catch((err) => {
                                                error(err);
                                            });

                                    })
                                    .catch((err) => {
                                        error(err);
                                    });
                            })
                            .catch((err) => {
                                console.error('Error fetching patientlist template', err);
                                error(err);
                            });
                    } else {
                        error('Not a patientlist report');
                    }
                })
                .catch((err) => {
                    error(err);
                })
        });
    }

    fetchPatientListTemplate(aggregateReport) {
        if (aggregateReport.dynamicJsonQueryGenerationDirectives &&
            aggregateReport.dynamicJsonQueryGenerationDirectives.patientListGenerator &&
            aggregateReport.dynamicJsonQueryGenerationDirectives.patientListGenerator.useTemplate) {
            let name = aggregateReport.dynamicJsonQueryGenerationDirectives.patientListGenerator.useTemplate;
            let version = aggregateReport.dynamicJsonQueryGenerationDirectives.patientListGenerator.useTemplateVersion;
            return this.fetchReportSchema(name, version);
        }
        // console.log('Invalid aggregate report. Missing template directives.')
        return Promise.reject('Invalid aggregate report. Missing template directives.');
    }

    determineBaseAndAggrSchema(schemas, indicators) {
        // console.log('finding aggregate report with indicators', indicators);
        let aggs = this.getAggregateWithIndicator(schemas, indicators);

        let found = [];

        aggs.forEach(agg => {
            let s = {
                aggregate: agg,
                base: schemas[agg.uses[0].name]
            };
            // console.log('added base agg pair', agg);
            found.push(s);
        });
        return found;
    }

    getAggregateWithIndicator(schemas, indicators) {
        let found = [];
        for (let s in schemas) {
            // console.log('schema:',schemas[s]);
            if (schemas[s].dynamicJsonQueryGenerationDirectives) {
                if (this.schemaHasColumns(schemas[s], indicators)) {
                    found.push(schemas[s]);
                }
            }
        }
        // console.log('found with agg indicator', found);
        return found;
    }

    schemaHasColumns(schema, columns) {
        // console.log('schema has columns', schema, columns);
        let foundAll = true;
        if (columns && columns.forEach) {
            columns.forEach(column => {
                let found = false;
                for (let i = 0; i < schema.columns.length; i++) {
                    let col = schema.columns[i];

                    if (col.alias === column || col.column === column ||
                        (typeof col.column === 'string' &&
                            col.column.slice(col.column.indexOf('.') + 1)) === column) {
                        // console.log('found', column, col);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    foundAll = false;
                }
            });
        } else {
            foundAll = false;
        }

        return foundAll;
    }

    generatePatientListJsonQuery(aggregateSchema, baseSchema, tempateSchema, params) {
        let gen = this.getPatientListGenerator(aggregateSchema, baseSchema, tempateSchema, params);
        return gen.generatePatientListSchema();
    }

    getPatientListGenerator(aggregateSchema, baseSchema, tempateSchema, params) {
        return new BasePatientListGen(baseSchema, aggregateSchema, tempateSchema, params);
    }

    consolidateParamsAndIndicators(params, indicators) {
        let consolidatedIndicators = [];
        indicators.forEach(indicator => {
            let generatedParams = [];
            if (this.isDynamicallyCreatedIndicator(indicator)) {
                let extracted = this.extractIndicators(indicator);
                for (let o in extracted) {
                    generatedParams.push({ key: o, value: extracted[o] })
                    consolidatedIndicators.push(o);
                }
            } else {
                generatedParams.push({ key: indicator, value: 1 });
                consolidatedIndicators.push(indicator);
            }

            generatedParams.forEach(paramValue => {
                if (params[paramValue.key] === undefined || params[paramValue.key] === null) {
                    params[paramValue.key] = paramValue.value === null ? 1 : paramValue.value;
                }
            });
        });
        return consolidatedIndicators;
    }

    addIndicatorsToParams(param, indicators) {
        indicators.forEach(element => {
            if (param[element] === undefined) {
                param[element] = 1;
            }
        });
    }

    extractIndicators(indicator) {
        let split = indicator.split('__');

        let indicators = {

        };

        for (let i = 1; i < split.length; i++) {
            if (this.isEven(i)) {
                indicators[split[i - 1]] = split[i];
            } else {
                indicators[split[i]] = null;
            }
        }

        return indicators;
    }

    // hack to take care of mis-matched schemas for an indicator
    hasEmptyDynamicExpressions(generated) {
        let hasEmpty = false;
        if (generated.generated.filters && generated.generated.filters.conditions.length > 0) {
            generated.generated.filters.conditions.forEach(condition => {
                if (condition.dynamicallyGenerated &&
                    condition.filterType === 'tableColumns' &&
                    condition.conditionExpression === '') {
                    hasEmpty = true;
                }
            });
        }
        return hasEmpty;
    }

    isEven(n) {
        return n % 2 == 0;
    }

    isOdd(n) {
        return Math.abs(n % 2) == 1;
    }

    isDynamicallyCreatedIndicator(indicator) {
        return indicator.startsWith('dc__');
    }
}