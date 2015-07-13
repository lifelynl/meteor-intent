/**
 * @summary Intent lets your [Meteor]{@link https://github.com/meteor/meteor} application remind a user's initial action or page over several route changes. Designed for use with [iron:router]{@link https://github.com/iron-meteor/iron-router}.
 * @desc View [repository]{@link https://github.com/lifelynl/meteor-intent} or [documentation]{@link https://github.com/lifelynl/meteor-intent/wiki}
 *
 * @license MIT
 * (c) 2015 Lifely
 *
 * @author Jesse de Vries jessedvrs@gmail.com
 *
 * @namespace Intent
 *
 */

Intent = (function(Meteor, Iron, Router) {
    'use strict';

    /**
     * @private
     * @memberof Intent
     * @desc Composes an error message.
     *
     * @param context {String} The context of the error message.
     * @param messages {String} The parts of the error message itself.
     * @returns composed_message {String} The composed message.
     */
    var _Error = function(context, message1, message2, etc) {
        var messages = Array.prototype.slice.call(arguments, 1);
        var message_prefix = 'Exception in Intent [' + context + ']:';

        if (_configuration.debug && console) {
            console.warn.apply(console, [message_prefix].concat(messages));
        };

        return message_prefix + ' ' + messages.join(' ');
    };

    /**
     * @private
     * @memberof Intent
     * @desc Composes a debug message and logs it to the console.
     *
     * @param context {String} The context of the debug message.
     * @param messages {String} The parts of the debug message itself.
     * @returns composed_message {String} The composed message.
     */
    var _Debug = function(context, message1, message2, etc) {
        if (!_configuration.debug || !console) return;

        var messages = Array.prototype.slice.call(arguments, 1);
        var message_prefix = 'Debug in Intent [' + context + ']:';

        console.info.apply(console, [message_prefix].concat(messages));
    };

    /**
     * @private
     * @memberof Intent
     * @namespace
     * @desc Holds place of the current configuration. Defaults can be configured here.
     */
    var _configuration = {
        debug:                     false,
        default_route_name:        null,
        default_route_parameters:  null,
        default_route_options:     null
    };

    /**
     * @private
     * @memberof Intent
     * @class
     *
     * @param origin {String} The current path (when the intent was initialized)
     * @param callback {Function} The callback of the intent
     * @param options {Object} Options for the intent
     */
    var _Intent = function(origin, callback, options) {
        this.origin = origin;
        this.callback = callback;
        this.options = {
            prevent_going_back: !!options.prevent_going_back
        };
    };

    /**
     * @private
     * @memberof Intent
     * @namespace
     * @desc The current _Intent objects. These are being saved by route name.
     */
    var _intents = {};

    /**
     * @private
     * @memberof Intent
     * @desc Go to the configured fallback route
     */
    var _toDefaultRoute = function() {
        var route = _configuration.default_route_name;
        if (!route) throw 'no default route configured';

        var params = _configuration.default_route_params;
        var options = _configuration.default_route_options;

        // Go to default route
        Router.go(route, params, options);
    };

    /**
     * @private
     * @memberof Intent
     */
    var _validate = {
        configuration: function(configuration) {
            return configuration && typeof configuration === 'object' && (Array.isArray ? !Array.isArray(configuration) : true);
        },
        debug: function(debug) {
            return typeof debug === 'boolean';
        },
        route_name: function(route_name) {
            return route_name && typeof route_name === 'string';
        },
        route_params: function(route_params) {
            return route_params && typeof route_params === 'object' && (Array.isArray ? !Array.isArray(route_params) : true);
        },
        route_options: function(route_options) {
            return route_options && typeof route_options === 'object' && (Array.isArray ? !Array.isArray(route_options) : true);
        },
        callback: function(callback) {
            return callback && typeof callback === 'function';
        },
        return_options: function(return_options) {
            return return_options && typeof return_options === 'object' && (Array.isArray ? !Array.isArray(return_options) : true);
        },
        fallback_action: function(fallback_action) {
            return fallback_action && typeof fallback_action === 'function';
        },
        fallback_route: function(fallback_route) {
            return fallback_route && typeof fallback_route === 'object' && (Array.isArray ? !Array.isArray(fallback_route) : true) && typeof fallback_route.name === 'string';
        },
        arguments: function(args) {
            return args && typeof args === 'object' && (Array.isArray ? Array.isArray(args) : true);
        }
    };

    /**
     * @private
     * @memberof Intent
     * @desc Go back to the original route whence the intent was initialized
     *
     * @param route_name {String} The name of the original route whence the intent was initialized
     */
    var _back = function(route_name, fallback_route) {
        var intent = _intents[route_name];

        // Trying intent origin
        if (intent && intent.origin) {
            Iron.Location.go(intent.origin);
            _Debug('Intent: _back()', 'going back to: ',  intent.origin);

        // Trying fallback route
        } else if (fallback_route) {
            Router.go(fallback_route.name, fallback_route.params, fallback_route.options);
            _Debug('Intent: _back()', 'going to fallback route: ', fallback_route);

        // Trying default route
        } else {
            _toDefaultRoute();
            _Debug('Intent: _back()', 'going to default route');
        }
    };

    /**
     * @public
     */
    var API = {

        /**
         * @desc Configure Intent
         * @memberof Intent
         *
         * @param conf {Object} Configuration object
         * @param conf.debug {Boolean} Enable debugging mode (logs some info to the console)
         * @param conf.default_route_name {String} Set default route name
         * @param conf.default_route_params {Object} Set default route params
         * @param conf.default_route_options {Object} Set default route options
         */
        configure: function(conf) {
            if (!_validate.configuration(conf)) throw _Error('Intent.configure()', 'no valid configuration specified');

            // debug
            if (conf.debug && _validate.debug(conf.debug))
                _configuration.debug = conf.debug;

            // default_route_name
            if (conf.default_route_name && _validate.route_name(conf.default_route_name))
                _configuration.default_route_name = conf.default_route_name;

            // default_route_params
            if (conf.default_route_params && _validate.route_params(conf.default_route_params))
                _configuration.default_route_params = conf.default_route_params;

            // default_route_options
            if (conf.default_route_options && _validate.route_options(conf.default_route_options))
                _configuration.default_route_options = conf.default_route_options;
        },

        /**
         * @desc Go to another route with iron:router, intentionally
         * @memberof Intent
         *
         * @param route_args {Object}
         * @param route_args.route {String} The name of the route
         * @param [route_args.params] {String} The parameters for the route
         * @param [route_args.options] {String} The options for the route
         * @param [callback] {Callback} The callback for the intent
         * @param [intent_options] {Object} The options for the intent
         * @param [intent_options.prevent_going_back] {Object} Prevent the intent to go back
         */
        go: function(route_args, callback, intent_options) {
            if (!route_args)
                throw _Error('Intent.go()', 'no route arguments specified');

            if (!_validate.route_name(route_args.route))
                throw _Error('Intent.go()', 'no route name specified');

            if (callback && !_validate.callback(callback))
                throw _Error('Intent.go()', 'no valid callback specified');

            // Saving route details
            var route = {
                name: route_args.route,
                params: _validate.route_params(route_args.params) ? route_args.params : {},
                options: _validate.route_options(route_args.options) ? route_args.options : {}
            };

            // Saving intent_options
            var options = {
                prevent_going_back: intent_options ? !!intent_options.prevent_going_back : false
            };

            try {

                // Get original path
                var origin = window.location.pathname + window.location.search;

                // Create & save intent by route name
                _intents[route.name] = new _Intent(origin, callback, options);
                _Debug('Intent.go()', 'saved Intent', _intents[route.name]);

                // Go to specified route
                Router.go(route.name, route.params, route.options);
                _Debug('Intent.go()', 'Fired Router.go() with', route);

            } catch (e) {
                throw _Error('Intent.go()', e);
            }
        },

        /**
         * @desc Return from an intent.
         * @memberof Intent
         *
         * @param route_name {String} The name of the route whence the intent was initialized
         * @param [return_options] {Object} Options for the return
         * @param [return_options.arguments] {Array} Arguments you want to pass to the callback
         * @param [return_options.fallback_action] {Callback} Fallback action for the intent
         * @param [return_options.fallback_route] {Object} Fallback route for the intent
         * @param [return_options.fallback_route.name] {String} Fallback route for the intent (name)
         * @param [return_options.fallback_route.params] {Object} Fallback route for the intent (params)
         * @param [return_options.fallback_route.options] {Object} Fallback route for the intent (options)
         */
        return: function(route_name, return_options) {
            if (!_validate.route_name(route_name))
                throw _Error('Intent.return()', 'no route name specified');

            if (return_options && !_validate.return_options(return_options))
                throw _Error('Intent.return()', 'return_options is not valid');

            if (return_options && return_options.arguments && !_validate.arguments(return_options.arguments))
                throw _Error('Intent.return()', 'return_options.arguments must be an array, or falsy when you don\'t want to pass any arguments');

            if (return_options && return_options.fallback_action && !_validate.fallback_action(return_options.fallback_action))
                throw _Error('Intent.return()', 'return_options.fallback_action must be a function, or falsy when you don\'t want to pass a fallback action');

            if (return_options && return_options.fallback_route && !_validate.fallback_route(return_options.fallback_route))
                throw _Error('Intent.return()', 'return_options.fallback_route must be an object with at least a \'name\', or falsy when you don\'t want to pass a fallback route');

            // Save the options
            var options = {
                arguments: return_options && return_options.arguments ? return_options.arguments : [],
                fallback_action: return_options && return_options.fallback_action ? return_options.fallback_action : null,
                fallback_route: return_options && return_options.fallback_route ? return_options.fallback_route : null
            };

            // Find intent by route_name
            var intent = _intents[route_name];

            // Go back to the original route (when no original route is known, try to go to the fallback_route)
            if (!intent || !intent.options.prevent_going_back) {
                try {
                    _back(route_name, options.fallback_route);
                } catch (e) {
                    throw _Error('Intent.return()', e);
                }
            }

            // Back function
            var __back = function() {
                if (intent && intent.origin) Iron.Location.go(intent.origin);
                else _toDefaultRoute();
            };

            Meteor.defer(function() {

                // Call the callback (when no callback exists, try to call the fallback_action)
                if (intent && intent.callback) {

                    // Original callback
                    intent.callback.apply({
                        back: __back
                    }, options.arguments);
                    _Debug('Intent.return()', 'fired callback for', route_name, 'with arguments', options.arguments);

                } else if (options.fallback_action) {

                    // Fallback_action if provided
                    options.fallback_action.apply({
                        back: __back
                    }, options.arguments);
                    _Debug('Intent.return()', 'could not find original callback. fired fallback-callback for', route_name);

                }

            });

            delete _intents[route_name];
        },

        /**
         * @desc Check whether an intent currently exists, by route name
         * @memberof Intent
         *
         * @param route_name {String} The name of the route to test
         * @returns exists {Boolean} Whether the intent exists
         */
        exists: function(route_name) {

            // Check whether an intent currently exists, by route name
            var exists = !!_intents[route_name];

            _Debug('Intent.exists()', 'checking whether an intent for', route_name, 'exists. result:', exists);

            return exists;
        }
    };

    return API;

})(Meteor, Iron, Router);
