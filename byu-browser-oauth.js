/*
 * Copyright 2018 Brigham Young University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const EVENT_PREFIX = 'byu-browser-oauth';

export const STATE_CHANGE_EVENT = `${EVENT_PREFIX}-state-changed`;
export const LOGIN_REQUESTED_EVENT = `${EVENT_PREFIX}-login-requested`;
export const LOGOUT_REQUESTED_EVENT = `${EVENT_PREFIX}-logout-requested`;
export const REFRESH_REQUESTED_EVENT = `${EVENT_PREFIX}-refresh-requested`;
export const STATE_REQUESTED_EVENT = `${EVENT_PREFIX}-state-requested`;

export const STATE_INDETERMINATE = 'indeterminate';
export const STATE_UNAUTHENTICATED = 'unauthenticated';
export const STATE_AUTHENTICATED = 'authenticated';
export const STATE_AUTHENTICATING = 'authenticating';
export const STATE_REFRESHING = 'refreshing';
export const STATE_EXPIRED = 'expired';
export const STATE_ERROR = 'error';

let store = {state: STATE_INDETERMINATE};

let observer = onStateChange(detail => {
    store = detail;
});

export function onStateChange(callback) {
    const func = function(e) {
        callback(e.detail);
    };
    document.addEventListener(STATE_CHANGE_EVENT, func, false);
    if (store.state === STATE_INDETERMINATE) {
        dispatch(STATE_REQUESTED_EVENT, {callback});
    } else {
        callback(store);
    }
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

export function teardown() {
    observer.offStateChange();
    store = {state: STATE_INDETERMINATE};
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

