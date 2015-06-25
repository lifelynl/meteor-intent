/**/
Intent = {

    /**
    * What happens when an error occurs
    */
    _Error: function(context, msg) {
        console.error('Exception in Intent [' + context + ']:' + msg);
    },

    /**
    * Placeholder for configuration
    */
    _configuration: {
        fallback_route_name: null,
        fallback_route_parameters: null,
        fallback_route_options: null
    },

    /**
    * Placeholder for returnObjects
    */
    _returnObjects: {},

    /**
    * returnObject constructor
    */
    _ReturnObject: function(origin, callback) {
        this.origin = origin;
        this.callback = callback;
    },

    /**
    * Return fallback
    */
    _defaultReturn: function() {
        var route = this._configuration.fallback_route_name;
        var params = this._configuration.fallback_route_params;
        var options = this._configuration.fallback_route_options;

        if (route) {
            Router.go(route, params, options);
        } else {
            throw 'invalid_route';
        }
    },

    /**
    * Configuration function
    */
    configure: function(configuration) {
        if (!configuration)                    throw this._Error('Intent.configure()', 'no configuration specified');
        if (typeof configuration !== 'object') throw this._Error('Intent.configure()', 'no valid configuration specified');

        if (configuration.fallback_route_name) this._configuration.fallback_route_name = configuration.fallback_route_name;
        if (configuration.fallback_route_params) this._configuration.fallback_route_params = configuration.fallback_route_params;
        if (configuration.fallback_route_options) this._configuration.fallback_route_options = configuration.fallback_route_options;
    },

    /**
    * Fire an intentional route change
    */
    go: function(args, callback) {
        var origin = Iron.Location.get().href;

        var key = args.route;
        this._returnObjects[key] = new this._ReturnObject(origin, callback);

        Router.go(args.route, args.params, args.options);
    },

    /**
    * Return from the intentional route change
    */
    return: function(key, passed_arguments, fallback) {
        var returnObject = this._returnObjects[key];

        var self = this;
        var _back = function() {
            self.back(key);
        };

        if (returnObject && returnObject.callback) {
            returnObject.callback(_back, passed_arguments);
            delete returnObject;
        } else if (typeof fallback === 'function') {
            fallback(_back, passed_arguments);
        } else {
            this.back(key);
        }
    },

    /**
    * Go back to the route where the intentional route change was initialized, bypassing the callback.
    */
    back: function(key) {
        var returnObject = this._returnObjects[key];

        if (returnObject && returnObject.origin) {
            Iron.Location.go(returnObject.origin);
            delete returnObject;
        } else {
            try {
                this._defaultReturn();
            } catch (e) {
                var msg = 'an error occured';

                if (e === 'invalid_route') {
                    msg = 'no default route configured';
                }

                throw this._Error('Intent.back()', msg);
            }
        }
    }
};
