import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiErrorResponse, UserDetailsResponse } from 'src/app/interfaces/ApiResponse';
import { ApiCandidateResponse } from 'src/app/interfaces/candidate';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { CandidateService } from 'src/app/services/candidates/candidate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private username = '';
  protected isLoading = false;
  protected authenticated = false;
  protected errors: { [key: string]: string } = {};
  protected candidates: { id: string; name: string; email: string; status: string }[] = [];
  protected newUser: { name: string; email: string; status: string } = { name: '', email: '', status: '' };

  private token = '';
  protected isLoadingButtonAddNewCandidate = false;
  protected isLoadingButtonScheduleCandidate = false;
  protected isLoadingButtonApproveCandidate = false;
  protected isLoadingButtonDisqualifyCandidate = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private candidateService: CandidateService,
  ) { }

  ngOnInit(): void {
    this.performAuthentication();
  }

  protected addUser() {

    if (this.buttonAddNewCandidateIsDisabled()) return;
    const candidate = { name: this.newUser.name, email: this.newUser.email };
    this.isLoadingButtonAddNewCandidate = true;

    this.candidateService.addCandidate(candidate, this.token).subscribe({

      next: (response: ApiCandidateResponse) => {
        this.handleAddCandidateSuccess(response);
      },
      error: (error: ApiErrorResponse) => {
        this.handleAddCandidateError(error);
      },
      complete: () => {
        this.isLoadingButtonAddNewCandidate = false;
      }
    });
  }

  protected schedule(candidateId: string, status: string) {

    if (this.isScheduleButtonDisabled(status)) return;
    this.isLoadingButtonScheduleCandidate = true;

    this.candidateService.scheduleCandidate(candidateId, this.token).subscribe({

      next: (response: ApiCandidateResponse) => {
        this.handleScheduleCandidateSuccess(response, candidateId);
      },
      error: (error: ApiErrorResponse) => {
        this.handleScheduleCandidateError(error);
      },
      complete: () => {
        this.isLoadingButtonScheduleCandidate = false;
      }
    });
  }

  protected approve(candidateId: string, status: string) {

    if (this.isApproveButtonDisabled(status)) return;
    this.isLoadingButtonApproveCandidate = true;

    this.candidateService.approveCandidate(candidateId, this.token).subscribe({

      next: (response: ApiCandidateResponse) => {
        this.handleApproveCandidateSuccess(response, candidateId);
      },
      error: (error: ApiErrorResponse) => {
        this.handleApproveCandidateError(error);
      },
      complete: () => {
        this.isLoadingButtonApproveCandidate = false;
      }
    });
  }

  protected disqualify(candidateId: string, status: string) {

    if (this.isDisqualifyButtonDisabled(status)) return;
    this.isLoadingButtonDisqualifyCandidate = true;

    this.candidateService.disqualifyCandidate(candidateId, this.token).subscribe({

      next: (response: ApiCandidateResponse) => {
        this.handleDisqualifyCandidateSuccess(response, candidateId);
      },
      error: (error: ApiErrorResponse) => {
        this.handleDisqualifyCandidateError(error);
      },
      complete: () => {
        this.isLoadingButtonDisqualifyCandidate = false;
      }
    });
  }

  private showSuccess(detail: string) {
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail,
      });
    }, 100);
  }

  private showError(detail: string) {
    const message = detail === undefined ? 'Algo de errado aconteceu! Tente novamente mais tarde' : detail;
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message
      });
    }, 100);
  }

  private performAuthentication(): void {
    const userToken = this.authService.getToken();
    if (userToken) {
      this.token = userToken;
      this.authService.getUserDetails(userToken).subscribe({
        next: (response: UserDetailsResponse) => {
          this.handleSuccessResponse(response);
        },
        error: (error: ApiErrorResponse) => {
          this.handleErrorResponse(error);
        }
      });
    } else {
      console.warn('UNAUTHORIZED');
      this.handleExpiredSession();
    }
  }

  private handleExpiredSession(): void {
    setTimeout(() => this.showError('Sessão expirada'), 0);
    setTimeout(() => this.navigateToLogin(), 1000);
  }

  private handleSuccessResponse = (response: UserDetailsResponse): void => {
    this.candidates = response.candidates;
    this.isLoading = false;
    this.authenticated = true;
    this.username = response.email;
    const message = 'Bem Vindo '.concat(this.username);
    this.showSuccess(message);
  };

  private handleErrorResponse = ({ error }: ApiErrorResponse): void => {
    this.isLoading = false;
    this.showError(error.message);
    console.warn(error);
    if (error.status === 'NOT_FOUND') {
      this.navigateToLogin();
    }
  };

  private handleAddCandidateSuccess(response: ApiCandidateResponse): void {
    this.showSuccess(response.message);
    this.isLoadingButtonAddNewCandidate = false;
    this.candidates.push({
      name: this.newUser.name,
      email: this.newUser.email,
      status: 'Received',
      id: response.candidateId
    });
    this.clearForm();
  }

  private handleAddCandidateError({ error }: ApiErrorResponse): void {
    this.showError(error.message);
    this.isLoadingButtonAddNewCandidate = false;
  }

  private handleScheduleCandidateSuccess(response: ApiCandidateResponse, candidateId: string): void {
    const candidate = this.candidates.find(c => c.id === candidateId);
    this.showSuccess(response.message);
    this.isLoadingButtonScheduleCandidate = false;
    if (candidate) { candidate.status = 'Qualified'; };
  }

  private handleScheduleCandidateError({ error }: ApiErrorResponse): void {
    this.showError(error.message);
    this.isLoadingButtonScheduleCandidate = false;
  }

  private handleApproveCandidateSuccess(response: ApiCandidateResponse, candidateId: string): void {
    const candidate = this.candidates.find(c => c.id === candidateId);
    this.showSuccess(response.message);
    this.isLoadingButtonApproveCandidate = false;
    if (candidate) { candidate.status = 'Approved'; };
  }

  private handleApproveCandidateError({ error }: ApiErrorResponse): void {
    this.showError(error.message);
    this.isLoadingButtonApproveCandidate = false;
  }

  private handleDisqualifyCandidateSuccess(response: ApiCandidateResponse, candidateId: string): void {
    const candidate = this.candidates.find(c => c.id === candidateId);
    this.showSuccess(response.message);
    this.isLoadingButtonDisqualifyCandidate = false;
    if (candidate) { candidate.status = 'Disqualified'; };
  }

  private handleDisqualifyCandidateError({ error }: ApiErrorResponse): void {
    this.showError(error.message);
    this.isLoadingButtonDisqualifyCandidate = false;
  }

  protected isScheduleButtonDisabled(status: string): boolean {
    return status != 'Received';
  }

  protected isApproveButtonDisabled(status: string): boolean {
    return status === 'Received' || status === 'Approved';
  }

  protected isDisqualifyButtonDisabled(status: string): boolean {
    return status === 'Received' || status == 'Disqualified'
  }

  protected buttonAddNewCandidateIsDisabled(): boolean {
    return !this.validateEmailFormat(this.newUser.email) || this.newUser.name.trim() === '';
  }

  private clearForm() {
    this.newUser.name = '';
    this.newUser.email = '';
    this.errors = {};
  }

  private validateEmailFormat(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private navigateToLogin() {
    this.router.navigate(['/']);
  }

}
