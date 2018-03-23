
import * as authn from './byu-browser-oauth.js';

export class FakeProvider {
    constructor({ noInitListeners, state, token, user } = {}) {
        this.state = state || authn.STATE_INDETERMINATE;
        this.token = token;
        this.user = user;
        if (!noInitListeners) {
            this.initListeners();
        }
    }

    initListeners() {
        this._observer = ({ detail }) => {
            detail.callback(this);
        };

        document.addEventListener(authn.EVENT_CURRENT_INFO_REQUESTED, this._observer, false);
    }

    setState(state, token, user) {
        this.state = state;
        this.token = token;
        this.user = user;
        dispatch(authn.EVENT_STATE_CHANGE, {state, token, user});
    }

    disconnect() {
        if (this._observer) {
            document.removeEventListener(authn.EVENT_CURRENT_INFO_REQUESTED, this._observer, false);
            delete this._observer;
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