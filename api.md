
# States

* Unauthenticated
* Authenticated
* Authenticating
* Indeterminate
* Refreshing
* Expired
* Error

# Data Structures

## Token
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
    rawUserInfo: {},
}
```

## User Info

```javascript
{
    personId: '',
    byuId: '',
    netId: '',
    name: {
        sortName: 'Student, Joseph Q',
        fullName: 'Joe Student', //constructed from givenName, familyName, and familyNamePosition
        givenName: 'Joe', //preferred first name
        familyName: 'Student',
        familyNamePosition: 'L', //or 'F'
    },
    rawUserInfo: {},
}
```

# Library API

* Determine if there is a token
* Get current token + metadata
* Get current user info
* Get notified of changes to token

```javascript

import * as authn from 'byu-browser-oauth';

authn.state();

authn.hasToken();

authn.token();

authn.authorizationHeader();

authn.user();

authn.onStateChange(({state, token, user}) => {

});

```

# Application Interface

```javascript

import * as authn from 'byu-browser-oauth';

authn.login();//Promise<{state, token, user}> - byu-browser-oauth-login-requested

authn.logout();//Promise<{state}> - byu-browser-oauth-logout-requested

authn.refresh();//Promise<{state, token, user}> - byu-browser-oauth-refresh-requested

```

# Provider API

```javascript

document.dispatchEvent(new CustomEvent('byu-browser-oauth-state-changed', {
    detail: {
        state: '',
        token: {},
        user: {},
    }
}));

document.addEventListener('byu-browser-oauth-login-requested', (e) => {});
document.addEventListener('byu-browser-oauth-logout-requested', (e) => {});
document.addEventListener('byu-browser-oauth-refresh-requested', (e) => {});

document.addEventListener('byu-browser-oauth-state-requested', ({detail}) => {
    detail.callback({state, token, user});
})

/**
  Library:

  document.dispatchEvent(new CustomEvent('byu-browser-oauth-state-requested, {detail: {callback: cb}}));
*/

```

