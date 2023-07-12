export interface ApiLoginResponse {
    token: string;
}

export interface ApiErrorResponse {
    error: {
        message: string;
        status: string;
    }
}

export interface UserDetailsResponse {
    email: string;
}