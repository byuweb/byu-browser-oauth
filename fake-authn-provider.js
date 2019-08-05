
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
        this._infoObserver = ({ detail }) => {
            detail.callback(this);
        };
        this._loginObserver = () => {
            this.setState(authn.STATE_AUTHENTICATED, this.token, this.user)
        };
        this._logoutObserver = () => {
            this.setState(authn.STATE_UNAUTHENTICATED, null, null)
        }
        this._refreshObserver = ({ detail }) => {
            if (detail == 'fail') {
                this.setState(authn.STATE_ERROR, null, null, 'failure')
            }
            // For testing, we're just passing through the "detail" field as the token, so
            // the test observer can easily verify that it was passed through
            this.setState(authn.STATE_AUTHENTICATED, detail, this.user)
        }

        document.addEventListener(authn.EVENT_CURRENT_INFO_REQUESTED, this._infoObserver, false);
        document.addEventListener(authn.EVENT_LOGIN_REQUESTED, this._loginObserver, false);
        document.addEventListener(authn.EVENT_LOGOUT_REQUESTED, this._logoutObserver, false);
        document.addEventListener(authn.EVENT_REFRESH_REQUESTED, this._refreshObserver, false);
    }

    setState(state, token, user, error) {
        this.state = state;
        this.token = token;
        this.user = user;
        dispatch(authn.EVENT_STATE_CHANGE, {state, token, user, error});
    }

    disconnect() {
        if (this._infoObserver) {
            document.removeEventListener(authn.EVENT_REFRESH_REQUESTED, this._logoutObserver, false);
            document.removeEventListener(authn.EVENT_LOGOUT_REQUESTED, this._logoutObserver, false);
            document.removeEventListener(authn.EVENT_LOGIN_REQUESTED, this._loginObserver, false);
            document.removeEventListener(authn.EVENT_CURRENT_INFO_REQUESTED, this._infoObserver, false);
            delete this._refreshObserver;
            delete this._logoutObserver;
            delete this._loginObserver;
            delete this._infoObserver;
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
