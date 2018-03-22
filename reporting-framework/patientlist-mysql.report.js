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

                    // determine patient list seed schemas
                    that.plSchemasRaw = this.determineBaseAndAggrSchema(that.reportSchemas);

                    that.fetchPatientListTemplate(that.plSchemasRaw.aggregate)
                        .then((template) => {
                            that.plTemplate = template;

                            let generated =
                                that.generatePatientListJsonQuery(that.plSchemasRaw.aggregate, that.plSchemasRaw.base, that.plTemplate, that.params);

                            that.generatedPL = {
                                main: generated.generated
                            };

                            that.modifiedParam = generated.params;

                            // generate query
                            that.generateReportQuery(that.generatedPL, that.modifiedParam)
                                .then((sqlQuery) => {
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
                                        .error((err) => {
                                            error(err);
                                        });

                                })
                                .error((err) => {
                                    error(err);
                                });
                        })
                        .catch((err) => {
                            error(err);
                        })
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
        return Promise.reject('Invalid aggregate report. Missing template directives.');
    }

    determineBaseAndAggrSchema(schemas, indicators) {
        let aggs = this.getAggregateWithIndicator(schemas, indicators);

        let found = [];

        aggs.forEach(agg => {
            let s = {
                aggregate: agg,
                base: schemas[agg.uses[0].name]
            };
            found.push(s);
        });
        return found;
    }

    getAggregateWithIndicator(schemas, indicators) {
        let found = [];
        for (let s in schemas) {
            if (schemas[s].dynamicJsonQueryGenerationDirectives) {
                if (this.schemaHasColumns(schemas[s], indicators)) {
                    found.push(schemas[s]);
                }
            }
        }
        return found;
    }

    schemaHasColumns(schema, columns) {
        let foundAll = true;
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
        return foundAll;
    }

    generatePatientListJsonQuery(aggregateSchema, baseSchema, tempateSchema, params) {
        let gen = this.getPatientListGenerator(aggregateSchema, baseSchema, tempateSchema, params);
        return gen.generatePatientListSchema();
    }

    getPatientListGenerator(aggregateSchema, baseSchema, tempateSchema, params) {
        return new BasePatientListGen(baseSchema, aggregateSchema, tempateSchema, params);
    }

}