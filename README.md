# byu-browser-oauth
OIT work towards a unified OAuth framework for our frontend libraries.


# Overview

This library provides a facade around OAuth authentication on the frontend.

In and of itself, this library does not know how to perform authentication. It does, however,
provide a pluggable, event-based system for sharing authentication information between an application
and any shared API client libraries or Web Components which it uses.

Shared libraries and UI components that require OAuth bearer tokens to make API calls should depend
on this library, and should bundle this library into their deployment artifacts.

Applications which use any such libraries or components must then use a compatible OAuth provider library:

* (TODO: implement and list provider libraries).

Applications may also wish to depend on this library directly.

# Installing and using

At this time, this library is intended to be bundled into any libraries or applications that use it.

Installation is via NPM or Yarn:

```
npm install --save @byuweb/browser-oauth
```

Or

```
yarn add @byuweb/browser-oauth
```

# API Overview

The library is distributed as an ES Module.

```javascript

import * as authn from './node_modules/@byuweb/browser-oauth/byu-browser-oauth.js';

```

## Data Types

There are three main data types: `User`, `Token`, and `AuthenticationError`.

### User

```javascript
{
    personId: '',
    byuId: '',
    netId: '',
    name: {
        sortName: 'Student, Joseph Q',
        displayName: 'Joe Student', //constructed from givenName, familyName, and familyNamePosition
        givenName: 'Joe', //preferred first name
        familyName: 'Student',
        familyNamePosition: 'L', //or 'F', for 'Last' and 'First'
    },
    rawUserInfo: {}, //provider-specific version of the user info object.
}
```

### Token

```javascript
{
    bearer: '',
    authorizationHeader: '',
    expiresAt: new Date(),
    client: {
        id: '',
        byuId: '',
        appName: '',
    },
    rawUserInfo: {}, //provider-specific version of the user info object.
}
```

## AuthenticationObserver

`AuthenticationObserver` allows you to be notified when the authentication state changes.

```javascript
    const observer = new authn.AuthenticationObserver(({state, token, user, error}) => {
        // React to change
    });
```

When an `AuthenticationObserver` is created, the authentication provider will be immediately queried for its current state, and will pass that
state to the callback. If you wish to disable this immediate callback, set the `notifyCurrent` option to false:

```javascript
    const observer = new authn.AuthenticationObserver(({state, token, user, error}) => {
        // React to changes, but not the initial state
    }, { notifyCurrent: false });
```

When you're done with the observer, like in the `disconnectedCallback()` method of a Web Component, call `disconnect()`

```javascript
    const observer = authn.onStateChange(({state, token, user, error}) => {
        // React to change
    });

    //in disconnectedCallback():
    observer.disconnect();
```

### Authentication States

State Name | Meaning
-----------|---------
`authn.STATE_INDETERMINATE` | Initial state. The authentication library is still initializing and retrieving state from the provider.
`authn.STATE_AUTHENTICATING` | The user is not yet authenticated, but the provider is working on authenticating them.
`authn.STATE_AUTHENTICATED` | The user is fully-authenticated.
`authn.STATE_UNAUTHENTICATED` | There is no authenticated user.
`authn.STATE_ERROR` | An authentication error ocurred. If this is the case, onStateChange will receive an 'error' parameter with details.
`authn.STATE_EXPIRED` | The user's token has expired. It may still be valid for a short amount of time, but the application should take steps to refresh the token.
`authn.STATE_REFRESHING` | The provider is in the process of refreshing an expired token.

## Current Values

Helper function are provided to get the current authentication state. These functions all return a Promise with the requested value.

### `authn.state()`

Get the current authentication state.

### `authn.hasToken()`

Resolves to `true` if there is a current, unexpired authentication token.

### `authn.token()`

Gets the current authentication token object.

### `authn.authorizationHeader()`

If we have a current token, get the computed `Authorization` header value.

### `authn.user()`

Get the current user object

## Request Actions

An application can request that the provider attempt to log in a user, log out a user, or refresh the user's session.

All of these functions return a promise that will resolve or reject when the requested action has been completed. However,
most authentication providers will need to navigate the user to an OAuth authorization server, and in those cases, these promises
will not resolve before the page is unloaded.

Shared libraries and UI components generally should not call these functions.

### `authn.login()`

Causes the authentication provider to begin a login process.

```javascript
authn.login()
    .then(({state, token, user, error}) => {
        // If we don't have to redirect the browser, you can respond to the completed login here
    });
```

### `authn.logout()`

Causes the authentication provider to begin a logout process.

```javascript
authn.logout()
    .then(({state, error}) => {
        // If we don't have to redirect the browser, you can respond to the completed logout here
    });
```

### `authn.refresh()`

Causes the authentication provider to refresh an expired token.

```javascript
authn.refresh()
    .then(({state, error}) => {
        // If we don't have to redirect the browser, you can respond to the completed refresh here
    });
```

# Development

The code is written using ES6 and ES Modules and uses Yarn as the canonical package manager.

Install dependencies with:

```
yarn
```

To run in-browser tests on all installed, supported browsers:

```
yarn test
```

To run a file watch and re-run tests whenever the files change:

```
yarn watch-test
```
