# Meteor Intent Package

## Prerequisites

- `meteor-platform` (obviously)
- `iron:router` or `meteorhacks:flow-router`

## Basic usage

- Install the package using `meteor add lifelynl:intent`.
- Configure the Intent using `Intent.configure({ fallback_route_name: 'home' })`. Possible configuration options are:

```
fallback_route_name       Required    The name of the route where Intent should fall back to
fallback_route_params     Optional    The parameters for the route where Intent should fall back to
fallback_route_options    Optional    The query and hash for the route where Intent should fall back to
```
