export interface ApiCandidateResponse {
    message: string;
    status: string;
    candidateId: string;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    status: string;
}
