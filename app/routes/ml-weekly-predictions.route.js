const preRequest = require('../../pre-request-processing');
const etlHelpers = require('../../etl-helpers');
const Boom = require('boom');

const {
  MlWeeklyPredictionsService
} = require('../../service/ml-weekly-predictions.service');

const routes = [];

exports.routes = (server) => server.route(routes);
