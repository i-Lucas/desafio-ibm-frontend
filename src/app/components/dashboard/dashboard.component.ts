import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiErrorResponse, UserDetailsResponse } from 'src/app/interfaces/ApiResponse';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private username = "";
  protected isLoading = false;
  authenticated: boolean = false;
  constructor(private authService: AuthenticationService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.performAuthentication();
  }

  private navigateToLogin() {
    this.router.navigate(['/']);
  }

  showSuccess(username: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Bem Vindo '.concat(username)
    });
  }

  showError(detail: string) {

    console.log(detail);
    const message = detail === undefined ?
      "Algo de errado aconteceu ! Tente novamente mais tarde" : detail;

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  performAuthentication(): void {

    const token = this.authService.getToken();
    if (token) {

      this.authService.getUserDetails(token)
        .subscribe({
          next: this.handleSuccessResponse,
          error: this.handleErrorResponse,
        })

    } else {
      console.error("UNAUTHORIZED");
      this.handleExpiredSession();
    }
  }

  handleExpiredSession(): void {
    setTimeout(() => this.showError("Sessão expirada"), 0);
    setTimeout(() => this.navigateToLogin(), 1000);
  }

  private handleSuccessResponse = (response: UserDetailsResponse): void => {
    this.isLoading = false;
    this.authenticated = true;
    this.username = response.email;
    setTimeout(() => this.showSuccess(this.username), 10);
  };

  private handleErrorResponse = (error: ApiErrorResponse): void => {
    this.isLoading = false;
    console.error(error.error.message);
    this.showError(error.error.message);
  };

}
