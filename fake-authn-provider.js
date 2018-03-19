import * as authn from './byu-browser-oauth.js';

export class FakeProvider {
    constructor(args) {
        const { noInitListeners } = args || {};
        this.state = authn.STATE_INDETERMINATE;
        this.token = null;
        this.user = null;
        if (!noInitListeners) {
            this.initListeners();
        }
    }

    initListeners() {
        this._stateReqObserver = ({ detail }) => {
            detail.callback(this);
        };

        document.addEventListener(authn.STATE_REQUESTED_EVENT, this._stateReqObserver, false);
    }

    setState(state, token, user, callback) {
        this.state = state;
        this.token = token;
        this.user = user;
        dispatch(authn.STATE_CHANGE_EVENT, {state, token, user});
        setTimeout(callback);
    }

    teardown() {
        dispatch(authn.STATE_CHANGE_EVENT, {state: authn.STATE_INDETERMINATE});
        if (this._observer) {
            document.removeEventListener(authn.STATE_REQUESTED_EVENT, this._stateReqObserver, false);
        }
    }
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