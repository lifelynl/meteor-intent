# Meteor Intent Package
[![LICENSE](http://img.shields.io/badge/LICENSE-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT) [![meteor package version](http://img.shields.io/badge/atmosphere-1.0.0-brightgreen.svg)](https://atmospherejs.com/lifelynl/intent)

Intent lets your [Meteor](https://github.com/meteor/meteor) application remind a user's initial action or page over several route changes (client-side only). Designed for use with [iron:router](https://github.com/iron-meteor/iron-router).

## Presentation slides
Slides.com: http://slides.com/jessedvrs/lifely-meteor-intent

## Prerequisites

- `meteor-platform` (obviously)
- `iron:router`

## Installation

- `meteor add lifelynl:intent`.
- Configure the Intent on the client using `Intent.configure({ default_route_name: 'home' })`. Possible configuration options are:

```
default_route_name       Required    The name of the route where Intent should fall back to
default_route_params     Optional    The parameters for the route where Intent should fall back to
default_route_options    Optional    The options for the route where Intent should fall back to
debug                    Optional    Enable debugging
```

## Example application

The example application enclose the most common cases for Intent. To view the example application:
- Checkout the repo with `git clone`
- `cd meteor-intent/examples`
- `meteor run`
- visit [localhost:3000](http://localhost:3000)

## Documentation

Please visit the [wiki on Github](https://github.com/lifelynl/meteor-intent/wiki/)!
