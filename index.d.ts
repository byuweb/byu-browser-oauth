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

export declare function state(): Promise<unknown>
export declare function hasToken(): Promise<boolean>
export declare function token(): Promise<Token>
export declare function authorizationHeader(): Promise<string>
export declare function user(): Promise<User>
export declare function login(): Promise<unknown>
export declare function logout(): Promise<unknown>
export declare function refresh(mode?: string): Promise<unknown>

export interface UserNameObject {
    displayName: string
    familyName?: string
    displayNamePosition?: string
    givenName?: string
    sortName?: string
}

export interface User {
    email: string
    byuId: string
    netId: string
    personId: string
    name: UserNameObject
}

export interface TokenClient {
    id: string
    byuId: string
    appName: string
}

export interface Token {
    bearer: string
    authorizationHeader: string
    expiresAt: Date
    client: TokenClient
    rawUserInfo: Record<string, unknown>
}
