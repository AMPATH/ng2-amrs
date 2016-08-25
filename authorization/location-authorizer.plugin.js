'use strict';
/**
 * This is a hapi js plugin that extends the route end points to allow
 * location based authorization.
 */
// External modules
var Boom = require('boom');
var Hoek = require('hoek');
var _ = require('underscore');

var pluginName = 'openmrsLocationAuthorizer';
var internals = {
    defaults: {
        locationParameter: [
            {
                type: 'params',//can be in either query or params so you have to specify
                name: 'uuid' //name of the location parameter
            }
        ],
    }
};

/**
 * Registers the plugin
 *
 * @param plugin
 * @param options
 * @param next
 */
exports.register = function (server, options, next) {

    try {


        var settings = Hoek.applyToDefaults(internals.defaults, options || {});

        server.bind({
            config: settings
        });

        // Validate the server options on the routes
        if (server.after) { // Support for hapi < 11
            server.after(internals.validateRoutes);
        } else {
            server.ext('onPreStart', internals.validateRoutes);
        }
        server.ext('onPreHandler', internals.onPreHandler);

        next();
    } catch (e) {
        next(e);
    }
};

/**
 * Gets the name and version of the hapi plugin
 * TODO: Return contents of a valid package.json
 */
exports.register.attributes = {
    name: pluginName,
    version: '1.0.0'
};


/**
 * Runs on server start and validates that every route that has openmrsLocationAuthorizer params is valid
 *
 * @param server
 * @param next
 */
internals.validateRoutes = function (server, next) {

    try {
        // Loop through each connection in the server
        server.connections.forEach(function (connection) {

            var routes = (connection.routingTable) ? connection.routingTable() : connection.table();

            // Loop through each route
            routes.forEach(function (route) {

                var locationAuthorizerParams = route.settings.plugins[pluginName] ? route.settings.plugins[pluginName] : false;

                // If there are openmrsLocationAuthorizer params and are not disabled by using "false", validate em
                if (locationAuthorizerParams !== false) {

                    // If there is a default auth
                    if (connection.auth.settings.default) {

                        // If there is also an auth on the route, make sure it's not false or null
                        if (route.settings.auth !== undefined) {

                            // Make sure that there is either a default auth being set, or that there is an auth specified on every route with locationAuthorizer plugin params
                            Hoek.assert(route.settings.auth !== null && route.settings.auth !== false, 'openmrsLocationAuthorizer can be enabled only for secured route');
                        }
                    }
                    // Else there is no default auth set, so validate each route's auth
                    else {
                        // Make sure that there is either a default auth being set, or that there is an auth specified on every route with locationAuthorizer plugin params
                        Hoek.assert(route.settings.auth && route.settings.auth !== null && route.settings.auth !== false, 'openmrsLocationAuthorizer can be enabled only for secured route');
                    }
                }
            });
        });
        next();
    }
    catch (err) {
        next(err);
    }
};

/**
 * Checks if openmrsLocationAuthorizer is active for the current route and execute the necessary steps accordingly.
 *
 * @param request
 * @param reply
 */
internals.onPreHandler = function (request, reply) {
    // Ignore OPTIONS requests
    if (request.route.method === 'options') {
        return reply.continue();
    }

    var params;
    try {
        // Check if the current route is openmrsLocationAuthorizer enabled
        params = internals.getRouteParams(request);
    }
    catch (err) {
        return reply(Boom.badRequest(err.message));
    }

    // if openmrsLocationAuthorizer is enabled, get the user
    if (params) {
        var user = request.auth.credentials;
        var routeSettings = request.route.settings.plugins[pluginName] || {locationParameter: [],exemptedParameter:[],aggregateReport:[]};
        if (user.authorizedLocations.length > 0) {

            var unAuthorisedOperationalLocations = [];
            var unAuthorisedAggregateLocations = [];
            var isExempted=false;
            var isAggregate=false;

            //check for exemptions
            isExempted= _.some(routeSettings.exemptedParameter||[], function (routeSetting) {
                var passedExemptedValue = request[routeSetting.type][routeSetting.name] || '';
                return passedExemptedValue===routeSetting.value;
            });

            //check if passedParam is aggregate
            isAggregate= _.some(routeSettings.aggregateReport||[], function (routeSetting) {
                var passedParamValue = request[routeSetting.type][routeSetting.name] || '';
                return passedParamValue===routeSetting.value;
            });

            if(isExempted===false) {
               if (isAggregate===true) {
                    //get all the selected locations that this user is not authorised to fetch data
                    _.each(routeSettings.locationParameter, function (routeSetting) {
                        var passedLocations = request[routeSetting.type][routeSetting.name] || 'All';
                        if (passedLocations === 'All') {
                            //this means the user did not limit request parameters to any locations
                            //therefore check if user is allowed to access all location
                            var isAuthorised = _.some(user.authorizedLocations, function (authorizedLocation) {
                                if (authorizedLocation.type==='aggregate') return authorizedLocation.uuid === '*'
                            });
                            if (!isAuthorised) unAuthorisedAggregateLocations.push('All');
                        } else {
                            _.each(passedLocations.split(','), function (passedLocation) {
                                if (passedLocation.length >0) { //validate passedLocation is a uuid
                                    //determine if user is authorised
                                    var isAuthorised = _.some(user.authorizedLocations, function (authorizedLocation) {
                                        if (authorizedLocation.type==='aggregate') {
                                            if (authorizedLocation.uuid === '*') return true;
                                            return authorizedLocation.uuid == passedLocation;
                                        }
                                    });
                                    //if not authorised then push the unauthorised locations
                                    if (!isAuthorised) unAuthorisedAggregateLocations.push(passedLocation);
                                }
                            })
                        }
                    });
              } else {
                    //get all the selected locations that this user is not authorised to fetch data
                    _.each(routeSettings.locationParameter, function (routeSetting) {
                        var passedLocations = request[routeSetting.type][routeSetting.name] || 'All';
                        if (passedLocations === 'All') {
                            //this means the user did not limit request parameters to any locations
                            //therefore check if user is allowed to access all location
                            var isAuthorised = _.some(user.authorizedLocations, function (authorizedLocation) {
                                if(authorizedLocation.type==='operational')return authorizedLocation.uuid === '*'
                            });
                            if (!isAuthorised) unAuthorisedOperationalLocations.push('All');
                        } else {
                            _.each(passedLocations.split(','), function (passedLocation) {
                                if (passedLocation.length >0) { //validate passedLocation is a uuid
                                    //determine if user is authorised
                                    var isAuthorised = _.some(user.authorizedLocations, function (authorizedLocation) {
                                        if(authorizedLocation.type==='operational') {
                                            if (authorizedLocation.uuid === '*') return true;
                                            return authorizedLocation.uuid == passedLocation;
                                        }
                                    });
                                    //if not authorised then push the unauthorised locations
                                    if (!isAuthorised) unAuthorisedOperationalLocations.push(passedLocation);
                                }
                            })
                        }
                    });
               }
            }
            //if any of the passed location is unauthorised then boom.forbidden() else reply.continue()
            if (unAuthorisedOperationalLocations.length > 0) {
                //construct message appropriately
                var authorisedOperationLocations =[];
                _.each(user.authorizedLocations, function(location) {
                    if (location.type==='operational') {
                        authorisedOperationLocations.push(location['name']) ;
                    }

                });
                if(authorisedOperationLocations.length > 0 ){
                    return reply(Boom.forbidden('You are only allowed to view operational data in '+authorisedOperationLocations.toString()||''
                        +' location(s)'));

                }else{

                    return reply(Boom.forbidden('You are not allowed to view operational data in any location '));
                }


            } else if  (unAuthorisedAggregateLocations.length > 0) {


                var authorisedAggregateLocations =[];
                _.each(user.authorizedLocations, function(location) {
                    if (location.type==='aggregate') {
                        authorisedAggregateLocations.push(location['name']) ;
                    }

                });
                if(authorisedAggregateLocations.length > 0 ){
                    return reply(Boom.forbidden('You are only allowed to view aggregate data in '+authorisedAggregateLocations.toString()||''
                        +' location(s)'));

                }else{

                    return reply(Boom.forbidden('You are not allowed to view aggregate data in any location '));
                }

            } else {
                reply.continue();
            }
        } else {
            //user is not authorised to any location
            return reply(Boom.forbidden('You are not Authorised to view data in any location. Please contact your system ' +
                'administrator to grant you access to the selected location(s)'));
        }

    } else {
        reply.continue();
    }
};

/**
 * Returns the plugin params for the current request
 *
 * @param request
 * @returns {*}
 */
internals.getRouteParams = function (request) {
    try {
        if (request.route.settings.plugins[pluginName]) {
            var params = request.route.settings.plugins[pluginName];
            return params;
        } else {
            return null;
        }
    } catch (ex) {
        return null;
    }
};
