export interface ApiResponseLogin {
    token: string;
}

export interface ApiError {
    error: {
        message: string;
        status: string;
    }
}