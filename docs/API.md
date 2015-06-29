# API

## Intent : <code>object</code>
View [repository](https://github.com/lifelynl/meteor-intent) or [documentation](https://github.com/lifelynl/meteor-intent/wiki)

**Kind**: global namespace
**Summary**: Intent lets your [Meteor](https://github.com/meteor/meteor) application remind a user&#x27;s initial action or page over several route changes. Designed for use with [iron:router](https://github.com/iron-meteor/iron-router).
**Author:** Jesse de Vries jessedvrs@gmail.com
**License**: MIT
(c) 2015 Lifely

* [Intent](#Intent) : <code>object</code>
  * [.configure(conf)](#Intent.configure)
  * [.go(route_args, [callback], [intent_options])](#Intent.go)
  * [.return(route_name, [return_options])](#Intent.return)
  * [.exists(route_name)](#Intent.exists) ⇒ <code>Boolean</code>

<a name="Intent.configure"></a>
### Intent.configure(conf)
Configure Intent

**Kind**: static method of <code>[Intent](#Intent)</code>

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>Object</code> | Configuration object |
| conf.debug | <code>Boolean</code> | Enable debugging mode (logs some info to the console) |
| conf.default_route_name | <code>String</code> | Set default route name |
| conf.default_route_params | <code>Object</code> | Set default route params |
| conf.default_route_options | <code>Object</code> | Set default route options |

<a name="Intent.go"></a>
### Intent.go(route_args, [callback], [intent_options])
Go to another route with iron:router, intentionally

**Kind**: static method of <code>[Intent](#Intent)</code>

| Param | Type | Description |
| --- | --- | --- |
| route_args | <code>Object</code> |  |
| route_args.route | <code>String</code> | The name of the route |
| [route_args.params] | <code>String</code> | The parameters for the route |
| [route_args.options] | <code>String</code> | The options for the route |
| [callback] | <code>Callback</code> | The callback for the intent |
| [intent_options] | <code>Object</code> | The options for the intent |
| [intent_options.prevent_going_back] | <code>Object</code> | Prevent the intent to go back |

<a name="Intent.return"></a>
### Intent.return(route_name, [return_options])
Return from an intent.

**Kind**: static method of <code>[Intent](#Intent)</code>

| Param | Type | Description |
| --- | --- | --- |
| route_name | <code>String</code> | The name of the route whence the intent was initialized |
| [return_options] | <code>Object</code> | Options for the return |
| [return_options.arguments] | <code>Array</code> | Arguments you want to pass to the callback |
| [return_options.fallback_action] | <code>Callback</code> | Fallback action for the intent |
| [return_options.fallback_route] | <code>Object</code> | Fallback route for the intent |
| [return_options.fallback_route.name] | <code>String</code> | Fallback route for the intent (name) |
| [return_options.fallback_route.params] | <code>Object</code> | Fallback route for the intent (params) |
| [return_options.fallback_route.options] | <code>Object</code> | Fallback route for the intent (options) |

<a name="Intent.exists"></a>
### Intent.exists(route_name) ⇒ <code>Boolean</code>
Check whether an intent currently exists, by route name

**Kind**: static method of <code>[Intent](#Intent)</code>
**Returns**: <code>Boolean</code> - exists  Whether the intent exists

| Param | Type | Description |
| --- | --- | --- |
| route_name | <code>String</code> | The name of the route to test |

