# Usage

## Installation

- To install the package, run `meteor add lifelynl:intent` in a Meteor application directory. You can also add `lifelynl:intent` to __.meteor/packages__ manually.
- Intent only works client-side. In your client-side configuration or bootstrap, call:

```js
Intent.configure({
    default_route_name: 'home', // required
    default_route_params: {},   // optional
    default_route_options: {},  // optional
    debug: false                // optional
});
```

## Table of contents
- [#1 Page return](#1-page-return)
- [#2 Page return with action](#2-page-return-with-action)
- [#3 Deep page return](#3-deep-page-return)
- [#4 Restricted routes](#4-restricted-routes)


## #1 Page return

Returning to a page after login.


#### Step 1: the login button
In the login button handler, use `Intent.go({route: 'login'})` instead of `{{ pathFor 'login' }}` or `Router.go('login')`.

```html
<template name="navbar">
    <a href="#" id="loginButton">Login</a>
</template>
```

```js
Template.navbar.events({
    'click #loginButton': function(event) {
        event.preventDefault();

        Intent.go({route: 'login'});
    }
});
```

#### Step 2: the login-form submit button
This is where the magic happens. In the login form submit button handler, use `Intent.return('login')`.

```html
<template name="login">
    <form id="loginform">
        ...
        <button>Login</button>
    </form>
</template>
```

```js
Template.login.events({
    'submit #loginform': function(event) {
        event.preventDefault();
        ...

        Intent.return('login');
    }
});
```

## #2 Page return with action

The initial action was commenting on an article, but the user has to login first.

#### Step 1: the post comment button
In the post comment button handler, check if the user is logged in. If not, call `Intent.go({route: 'login'}, <callback>)`. In the callback, you can perform the initial action.

```html
<template name="comment">
    <form id="commentform">
        ...
        <button>Post comment</button>
    </form>
</template>
```

```js
Template.comment.events({
    'submit #commentform': function(event) {
        event.preventDefault();

        var persist = function() { ... };

        if (Meteor.user()) {
            persist();
        } else {
            Intent.go({route: 'login'}, function(user) {
                if (user) persist();
            });
        }
    }
});
```

#### Step 2: the login-form submit button
In the login form submit button handler, use `Intent.return('login', {arguments: [user]})`.

```html
<template name="login">
    <form id="loginform">
        ...
        <button>Login</button>
    </form>
</template>
```

```js
Template.login.events({
    'submit #loginform': function(event) {
        event.preventDefault();
        ...

        Intent.return('login', {
            arguments: [Meteor.user()]
        });
    }
});
```

#### Step 3: a cancel button
In the login form, you may want to add a cancel button now.

```html
<template name="login">
    <form id="loginform">
        ...
        <button>Login</button>
        <a href="#" id="cancelLogin">Cancel</a>
    </form>
</template>
```

```js
Template.login.events({
    ...
    'click #cancelLogin': function(event) {
        event.preventDefault();
        Intent.return('login');
    }
});
```

## #3 Deep page return

The user wanted to post a comment on an article, but he's not logged in and he doesn't have a user account yet. He has to sign up in the post comment flow.

#### Step 1: the post comment button
Exactly the same as [__Page return with action > Step 1__](#step-1-the-post-comment-button).

#### Step 2: the signup button
In the HTML, we'll want use the basic `pathFor` helper (from iron:router).

```html
<template name="login">
    <p>If you don't have an account yet, please <a href="{{ pathFor 'signup' }}" id="signupButton">sign up</a> first.</p>
    <form id="loginform">
        ...
        <button>Login</button>
    </form>
</template>
```

If a login-intent currently exists, we will prevent this pathFor-action and we'll create an intent for the signup screen. Right now, two intents are pending at the same time.

We want to prevent the automatic page return when the signup is done. Instead, we want the check if the user is present first. If so, we can call `Intent.return('login')` directly, so we can prevent iron:router from going to the login route on its way back.

If no user is present here, we'll want to call `this.back()` to send the user back to the login page anyway. This happens, for example, when the user hits the cancel button on the signup page.

```js
Template.login.events({
    'click #signupButton': function(event) {
        if (Intent.exists('login')) {
            event.preventDefault();

            Intent.go('signup', function(user) {
                if (user) {
                    Intent.return('login', {
                        arguments: [user]
                    });
                } else {
                    this.back();
                }
            }, {
                prevent_going_back: true
            });
        }
    }
});
```

#### Step 3: the signup submit button and cancel button
In the signup form, you may handle the signup submit button and cancel button just like you handled them in [__Page return with action > Step 2 & 3__](#step-2-the-login-form-submit-button_1).

```js
// ... in the submit event handler
Intent.return('signup', {
    arguments: [Meteor.user()]
});

// ... in the cancel button event handler
Intent.return('signup');
```

## #4 Restricted routes

#### Without Intent

Some routes may be protected. You usually would do that with iron:router like this:

```js
Router.onBeforeAction(function() {
    if (Meteor.user()) {
        this.next();
    } else {
        this.render('login');
    }
}, {
    where: 'client',
    only: [
        'new-article'
    ]
});
```

But then, when the login is successful, you can't send the user to the page he intended to go to.


#### With Intent
With Intent, you can. Just like this:

```js
Router.onBeforeAction(function() {
    var next = this.next;

    if (Meteor.user()) {
        next();
    } else {
        Intent.go({route: 'login'}, function(user) {
            if (user) next();
            else this.back();
        }, {prevent_going_back: true});
    }
}, {
    where: 'client',
    only: [
        'new-article'
    ]
});
```

When no user is present, go to the login route with the `prevent_going_back: true` option. When the user is present in the callback, call `next()` to proceed to the intended route. Otherwise, call `this.back()` to send the user back to the original route (because apparently the login failed).
