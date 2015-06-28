/**
 * Repo: https://github.com/lifelynl/meteor-intent
 * Docs:
 *
 * @module Intent
 * @requires iron:router
 */
Intent = (function(Iron, Router) {

    /**
     * @private
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
     * @namespace
     * @desc Holds place of the current configuration. Defaults can be configured here.
     */
    var _configuration = {
        debug:                      false,
        fallback_route_name:        null,
        fallback_route_parameters:  null,
        fallback_route_options:     null
    };

    /**
     * @private
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
     * @namespace
     * @desc The current _Intent objects. These are being saved by route name.
     */
    var _intents = {};

    /**
     * @private
     * @desc Go to the configured fallback route
     */
    var _toFallbackRoute = function() {
        var route = _configuration.fallback_route_name;
        if (!route) throw 'no default route configured';

        var params = _configuration.fallback_route_params;
        var options = _configuration.fallback_route_options;

        Router.go(route, params, options);
    };

    /**
     * @private
     */
    var _validate = {
        route_name: function(route_name) {
            return route_name && typeof route_name === 'string';
        },
        route_params: function(route_params) {
            return route_params && typeof route_params === 'object' && (Array.isArray ? !Array.isArray(route_params) : true);
        },
        route_options: function(route_options) {
            return route_options && typeof route_options === 'object' && (Array.isArray ? !Array.isArray(route_params) : true);
        },
        debug: function(debug) {
            return typeof debug === 'boolean';
        },
        arguments: function(args) {
            return args && typeof args === 'object' && (Array.isArray ? Array.isArray(args) : true);
        },
        configuration: function(configuration) {
            return configuration && typeof configuration === 'object' && (Array.isArray ? !Array.isArray(configuration) : true);
        },
        intent_options: function(intent_options) {
            return intent_options && typeof intent_options === 'object' && (Array.isArray ? !Array.isArray(configuration) : true);
        }
    };

    /**
     * @private
     * @desc Go back to the original route whence the intent was initialized
     *
     * @param route_name {String} The name of the original route whence the intent was initialized
     */
    var _back = function(route_name) {
        var intent = _intents[route_name];

        if (intent && intent.origin) {
            Iron.Location.go(intent.origin);
            delete intent;
            _Debug('Intent: _back()', 'going back to: ' + intent.origin);
        } else {
            _toFallbackRoute();
            _Debug('Intent: _back()', 'going to fallback route');
        }
    };

    /**
     * @public
     */
    var API = {

        /**
         * @desc Configure Intent
         */
        configure: function(c) {
            if (!_validate.configuration(c)) throw _Error('Intent.configure()', 'no valid configuration specified');

            if (c.debug && _validate.debug(c.debug))
                _configuration.debug = c.debug;

            if (c.fallback_route_name && _validate.route_name(c.fallback_route_name))
                _configuration.fallback_route_name = c.fallback_route_name;

            if (c.fallback_route_params && _validate.route_params(c.fallback_route_params))
                _configuration.fallback_route_params = c.fallback_route_params;

            if (c.fallback_route_options && _validate.route_options(c.fallback_route_options))
                _configuration.fallback_route_options = c.fallback_route_options;
        },

        /**
         * @desc Go to another route with iron:router, intentionally
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

            if (!callback)
                throw _Error('Intent.go()', 'no valid callback specified');

            var route = {
                name: route_args.route,
                params: _validate.route_params(route_args.params) ? route_args.params : {},
                options: _validate.route_options(route_args.options) ? route_args.options : {}
            };

            var validated_intent_options = _validate.intent_options(intent_options) ? intent_options : {}

            try {
                var origin = Iron.Location.get().href;
                _intents[route.name] = new _Intent(origin, callback, validated_intent_options);
                _Debug('Intent.go()', 'saved Intent', _intents[route.name]);

                Router.go(route.name, route.params, route.options);
                _Debug('Intent.go()', 'Fired Router.go() with', route);
            } catch (e) {
                throw _Error('Intent.go()', e);
            }
        },

        /**
         * @desc Return from an intent.
         *
         * @param key {String} The name of the route whence the intent was initialized
         * @param [return_options] {Object} Options for the return
         * @param [return_options.arguments] {Array} Arguments you want to pass to the callback
         * @param [return_options.fallback] {Callback} Fallback callback for the intent
         */
        return: function(route_name, return_options) {
            if (!_validate.route_name(route_name))
                throw _Error('Intent.return()', 'no route name specified');

            if (return_options && !_validate.arguments(return_options))
                throw _Error('Intent.return()', 'return_options is not valid');

            if (return_options && !_validate.arguments(return_options.arguments))
                throw _Error('Intent.return()', 'return_options.arguments must be an array, or falsy when you don\'t want to pass any arguments');

            if (return_options && !_validate.arguments(return_options.fallback))
                throw _Error('Intent.return()', 'return_options.arguments must be a function, or falsy when you don\'t want to pass a fallback callback');

            var options = {
                arguments: return_options && return_options.arguments ? return_options.arguments : [],
                fallback: return_options && return_options.fallback ? return_options.fallback : null
            };

            var __back = function() {
                try {
                    _back(route_name);
                } catch (e) {
                    throw _Error('Intent.return()', e);
                }
            };

            var intent = _intents[route_name];

            if (!intent || !intent.options.prevent_going_back) {
                _back(route_name);
            }

            if (intent && intent.callback) {
                intent.callback(options.arguments);
                _Debug('Intent.return()', 'fired callback for', route_name, 'with arguments', options.arguments);
                delete intent;
            } else if (options.fallback) {
                return_options.fallback(options.arguments);
                _Debug('Intent.return()', 'could not find original callback. fired fallback-callback for', route_name);
            }

        }
    };

    return API;

})(Iron, Router);
