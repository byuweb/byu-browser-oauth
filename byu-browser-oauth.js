
export const EVENT_PREFIX = 'byu-browser-oauth';

export const STATE_CHANGE_EVENT = `${EVENT_PREFIX}-state-changed`;
export const LOGIN_REQUESTED_EVENT = `${EVENT_PREFIX}-login-requested`;
export const LOGOUT_REQUESTED_EVENT = `${EVENT_PREFIX}-logout-requested`;
export const REFRESH_REQUESTED_EVENT = `${EVENT_PREFIX}-refresh-requested`;
export const STATE_REQUESTED_EVENT = `${EVENT_PREFIX}-state-requested`;

export const STATE_UNAUTHENTICATED = 'unauthenticated';
export const STATE_AUTHENTICATED = 'authenticated';
export const STATE_AUTHENTICATING = 'authenticating';
export const STATE_INDETERMINATE = 'indeterminate';
export const STATE_REFRESHING = 'refreshing';
export const STATE_EXPIRED = 'expired';
export const STATE_ERROR = 'error';

let store = {state: STATE_INDETERMINATE};

onStateChange(detail => {
    store = detail;
});

export function onStateChange(callback) {
    const func = function(e) {
        callback(e.detail);
    };
    document.addEventListener(STATE_CHANGE_EVENT, func, false);
    dispatch(STATE_REQUESTED_EVENT, {callback});
    return {
        offStateChange: function() {
            document.removeEventListener(STATE_CHANGE_EVENT, func, false);
        }
    }
}

export function state() {
    return store.state;
}

export function hasToken() {
    return !!store.token;
}

export function token() {
    return store.token;
}

export function authorizationHeader() {
    return store.token && store.token.authorizationHeader;
}

export function user() {
    return store.user;
}

export function login() {
    const promise = promiseState([STATE_AUTHENTICATED])
    dispatch(LOGIN_REQUESTED_EVENT);
    return promise;
}

export function logout() {
    const promise = promiseState([STATE_UNAUTHENTICATED]);
    dispatch(LOGOUT_REQUESTED_EVENT);
    return promise;
}

export function refresh() {
    const promise = promiseState([STATE_AUTHENTICATED, STATE_UNAUTHENTICATED]);
    dispatch(REFRESH_REQUESTED_EVENT);
    return promise;
}

function promiseState(desiredStates) {
    if (!window.Promise) {
        return null;
    }
    return new Promise((resolve, reject) => {
        const observer = onStateChange(({state, token, user, error}) => {
            if (error) {
                reject(error);
                observer.offStateChange();
            } else if (desiredStates.indexOf(state) >= 0) {
                resolve({state, token, user});
                observer.offStateChange();
            }
        });
    });
}

function dispatch(name, detail) {
    let event;
    if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent(name, {detail});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, false, detail);
    }
    document.dispatchEvent(event);
}

