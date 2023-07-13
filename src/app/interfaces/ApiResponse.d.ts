import { Candidate } from "./candidate";

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
    candidates: Candidate[],
    email: string;
}

export interface ApiSignupResponse {
    status: number;
    statusText: string;
}