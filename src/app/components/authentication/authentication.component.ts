import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiLoginResponse, ApiErrorResponse } from 'src/app/interfaces/ApiResponse';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {

  protected name: string = '';
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';

  protected errors: { [key: string]: string } = {};

  protected isRegisterMode: boolean = false;
  protected isLoading: boolean = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log("prod ", environment.production);
  }

  protected submit() {
    if (this.isFormValid()) {

      this.isLoading = true;

      if (this.isRegisterMode) {
        this.authService
          .signUp({ email: this.email, password: this.password })
          .subscribe({
            next: this.handleSuccessResponseSignup,
            error: this.handleErrorResponseSignup,
            complete: this.handleCompleteSignup,
          });
      } else {
        this.authService
          .signIn({ email: this.email, password: this.password })
          .subscribe({
            next: this.handleSuccessResponse,
            error: this.handleErrorResponse,
            complete: this.handleComplete,
          });
      }
    } else {
      this.catchError();
    }
  }

  private getFormTextError() {
    return {
      name_required: 'O campo Nome é obrigatório.',
      small_name: 'O Nome deve ter no mínimo 5 caracteres',
      email_required: 'O campo Email é obrigatório.',
      invalid_email: 'Email inválido.',
      password_required: 'O campo Senha é obrigatório.',
      small_password: 'A senha deve ter no mínimo 5 caracteres',
      bad_password: 'A confirmação de senha não corresponde à senha digitada.',
      phone_required: 'O campo Telefone é obrigatório.',
      bad_phone: 'Telefone inválido',
    };
  }

  private catchError() {
    const allFields = ['email', 'password', 'confirmPassword'];
    const loginFields = allFields.slice(0, 1);
    const currentField = this.isRegisterMode ? allFields : loginFields;

    for (let field of currentField) {
      if (this.errors[field]) {
        this.showError(this.errors[field]);
      }
    }
  }

  private handleErrorResponseSignup = (err: any) => {
    this.isLoading = false;
    const errorObject = JSON.parse(err.error);
    const errorMessage = errorObject.message;
    this.showError(errorMessage);
  };

  private handleCompleteSignup = () => {
    this.isRegisterMode = false;
    this.router.navigate(['/']);
  };

  private validateEmail() {
    if (!this.email || this.email.trim() === '') {
      this.errors['email'] = this.getFormTextError().email_required;
    } else if (!this.validateEmailFormat(this.email)) {
      this.errors['email'] = this.getFormTextError().invalid_email;
    }
  }

  protected getFormText() {
    const label1 = this.isRegisterMode ? 'Já possui uma conta ?' : 'Não tem uma conta ?';
    const label2 = this.isRegisterMode ? 'Entrar' : 'Cadastre-se';
    const btn = this.isRegisterMode ? 'Cadastrar' : 'Entrar';
    const recruter = this.isRegisterMode ? 'Sou Recrutador' : 'Sou Candidato';
    return { label1, label2, btn, recruter };
  }

  private validatePassword() {
    if (!this.password || this.password.trim() === '') {
      this.errors['password'] = this.getFormTextError().password_required;
    } else if (this.password.length < 5 && this.isRegisterMode) {
      this.errors['password'] = this.getFormTextError().small_password;
    }
  }

  private isFormValid() {
    this.clearErrors();
    this.validateEmail();
    this.validatePassword();
    if (this.isRegisterMode) {
      this.validateConfirmPassword();
    }
    return Object.keys(this.errors).length === 0;
  }

  private handleSuccessResponse = (response: ApiLoginResponse): void => {
    this.isLoading = false;
    this.authService.saveToken(response.token);
  };

  private handleErrorResponse = ({ error }: ApiErrorResponse): void => {
    this.isLoading = false;
    this.showError(error.message);
  };

  private handleComplete = (): void => {
    this.router.navigate(['/dashboard']);
  };

  private handleSuccessResponseSignup = (res: string) => {
    this.isLoading = false;
    this.showSuccess(res);
  };

  private validateEmailFormat(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private validateConfirmPassword() {
    if (this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = this.getFormTextError().bad_password;
    }
  }

  private showSuccess(detail: string) {
    this.showMessage('success', 'Success', detail);
  }

  private showError(detail: string) {
    const message = detail === undefined ? 'Algo de errado aconteceu! Tente novamente mais tarde' : detail;
    this.showMessage('error', 'Error', message);
  }

  private showMessage(severity: string, summary: string, detail: string) {
    setTimeout(() => this.messageService.add({ severity, summary, detail }), 100);
  }

  protected toggleMode() {
    this.clearErrors();
    this.isRegisterMode = !this.isRegisterMode;
  }

  private clearErrors() {
    this.errors = {};
  }
}