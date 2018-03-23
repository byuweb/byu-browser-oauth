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

import {
    EVENT_STATE_CHANGE,
    EVENT_LOGIN_REQUESTED,
    EVENT_LOGOUT_REQUESTED,
    EVENT_REFRESH_REQUESTED,
    EVENT_CURRENT_INFO_REQUESTED,

    STATE_INDETERMINATE,
    STATE_AUTHENTICATED,
    STATE_UNAUTHENTICATED,
} from './constants.js';

export * from './constants.js';

export class AuthenticationObserver {
    constructor(callback, { notifyCurrent = true } = {} ) {
        this._listener = function (e) {
            callback(e.detail);
        };
        document.addEventListener(EVENT_STATE_CHANGE, this._listener, false);
        if (notifyCurrent) {
            dispatch(EVENT_CURRENT_INFO_REQUESTED, { callback });
        }
    }

    disconnect() {
        document.removeEventListener(EVENT_STATE_CHANGE, this._listener, false);
    }
}

async function queryCurrentInfo() {
    return new Promise((resolve, reject) => {
        const callback = (detail) => {
            if (detail.error) {
                reject(detail.error);
            } else {
                resolve(detail);
            }
        };
        dispatch(EVENT_CURRENT_INFO_REQUESTED, { callback });
    });
}

export async function state() {
    const info = await queryCurrentInfo();
    return info.state;
}

export async function hasToken() {
    return !!await token();
}

export async function token() {
    const info = await queryCurrentInfo();
    return info.token;
}

export async function authorizationHeader() {
    const {token = {}} = await queryCurrentInfo();
    return token.authorizationHeader;
}

export async function user() {
    const info = await queryCurrentInfo();
    return info.user;
}

export async function login() {
    const promise = promiseState([STATE_AUTHENTICATED])
    dispatch(EVENT_LOGIN_REQUESTED);
    return promise;
}

export async function logout() {
    const promise = promiseState([STATE_UNAUTHENTICATED]);
    dispatch(EVENT_LOGOUT_REQUESTED);
    return promise;
}

export async function refresh() {
    const promise = promiseState([STATE_AUTHENTICATED, STATE_UNAUTHENTICATED]);
    dispatch(EVENT_REFRESH_REQUESTED);
    return promise;
}

function promiseState(desiredStates) {
    if (!window.Promise) {
        return {then: () => {}, catch: () => {}, finally: () => {}};
    }
    return new Promise((resolve, reject) => {
        const observer = new AuthenticationObserver(({ state, token, user, error }) => {
            if (error) {
                reject(error);
                observer.offStateChange();
            } else if (desiredStates.indexOf(state) >= 0) {
                resolve({ state, token, user });
                observer.disconnect();
            }
        });
    });
}

function dispatch(name, detail) {
    let event;
    if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent(name, { detail });
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, false, detail);
    }
    document.dispatchEvent(event);
}

