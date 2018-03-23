export const EVENT_PREFIX = 'byu-browser-oauth';

export const EVENT_STATE_CHANGE = `${EVENT_PREFIX}-state-changed`;
export const EVENT_LOGIN_REQUESTED = `${EVENT_PREFIX}-login-requested`;
export const EVENT_LOGOUT_REQUESTED = `${EVENT_PREFIX}-logout-requested`;
export const EVENT_REFRESH_REQUESTED = `${EVENT_PREFIX}-refresh-requested`;
export const EVENT_CURRENT_INFO_REQUESTED = `${EVENT_PREFIX}-current-info-requested`;

export const STATE_INDETERMINATE = 'indeterminate';
export const STATE_UNAUTHENTICATED = 'unauthenticated';
export const STATE_AUTHENTICATED = 'authenticated';
export const STATE_AUTHENTICATING = 'authenticating';
export const STATE_REFRESHING = 'refreshing';
export const STATE_EXPIRED = 'expired';
export const STATE_ERROR = 'error';

