// Basic auto-generated declaration file

export declare const EVENT_PREFIX: string
export declare const EVENT_STATE_CHANGE: string
export declare const EVENT_LOGIN_REQUESTED: string
export declare const EVENT_LOGOUT_REQUESTED: string
export declare const EVENT_REFRESH_REQUESTED: string
export declare const EVENT_CURRENT_INFO_REQUESTED: string
export declare const STATE_INDETERMINATE: string
export declare const STATE_UNAUTHENTICATED: string
export declare const STATE_AUTHENTICATED: string
export declare const STATE_AUTHENTICATING: string
export declare const STATE_REFRESHING: string
export declare const STATE_EXPIRED: string
export declare const STATE_ERROR: string

export declare class AuthenticationObserver {
    constructor (
      callback: (params?: any) => void,
      options?: { notifyCurrent?: boolean }
    )
    disconnect(): void
}

export declare function state(): Promise<any>
export declare function hasToken(): Promise<boolean>
export declare function token(): Promise<string>
export declare function authorizationHeader(): Promise<string>
export declare function user(): Promise<any>
export declare function login(): Promise<any>
export declare function logout(): Promise<any>
export declare function refresh(mode?: string): Promise<any>
