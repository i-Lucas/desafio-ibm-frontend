import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiLoginResponse, ApiErrorResponse } from 'src/app/interfaces/ApiResponse';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})

export class AuthenticationComponent {

  protected name: string = "";
  protected email: string = "";
  protected password: string = "";
  protected confirmPassword: string = "";
  protected phone: string = "";
  protected company: string = "";
  protected errors: { [key: string]: string } = {};

  protected isRecruiter: boolean = false;
  protected isRegisterMode: boolean = false;
  protected isLoading: boolean = false;

  constructor(private messageService: MessageService, private authService: AuthenticationService, private router: Router) { }

  submit() {

    if (this.isFormValid()) {

      this.isLoading = true;

      this.authService.signIn({ email: this.email, password: this.password })
        .subscribe({
          next: this.handleSuccessResponse,
          error: this.handleErrorResponse,
          complete: this.handleComplete
        })

    } else {
      this.catchError();
    }
  }

  private handleSuccessResponse = (response: ApiLoginResponse): void => {
    this.isLoading = false;
    this.authService.saveToken(response.token);
  };

  private handleErrorResponse = (error: ApiErrorResponse): void => {
    this.isLoading = false;
    console.error(error.error.message);
    this.showError(error.error.message);
  };

  private handleComplete = (): void => {
    this.router.navigate(['/dashboard']);
  }

  catchError() {

    const allFields = ["email", "password", "name", "confirmPassword", "phone"];
    const loginFields = allFields.slice(0, 2);
    const currentField = this.isRegisterMode ? allFields : loginFields;

    for (let field of currentField) {
      if (this.errors[field]) {
        this.showError(this.errors[field]);
      }
    }
  }

  showError(detail: string) {
    const message = detail === undefined ?
      "Algo de errado aconteceu ! Tente novamente mais tarde" : detail;

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  toggleMode() {
    this.clearErrors();
    this.isRegisterMode = !this.isRegisterMode;
  }

  validateForm() {
    this.clearErrors();
    this.validateName();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validatePhone();
  }

  validateName() {
    if (!this.name || this.name.trim() === '') {
      this.errors['name'] = this.getFormTextError().name_required;
    } else if (this.name.length < 3) {
      this.errors['name'] = this.getFormTextError().small_name;
    }
  }

  validateEmail() {
    if (!this.email || this.email.trim() === '') {
      this.errors['email'] = this.getFormTextError().email_required;
    } else if (!this.validateEmailFormat(this.email)) {
      this.errors['email'] = this.getFormTextError().invalid_email;
    }
  }

  validateEmailFormat(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validatePassword() {
    if (!this.password || this.password.trim() === '') {
      this.errors['password'] = this.getFormTextError().password_required;
    } else if (this.password.length < 5) {
      this.errors['password'] = this.getFormTextError().small_password;
    }
  }

  validateConfirmPassword() {
    if (this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = this.getFormTextError().bad_password;
    }
  }

  validatePhone() {
    if (!this.phone || this.phone.trim() === '') {
      this.errors['phone'] = this.getFormTextError().phone_required;
    } else if (!/\d{11}/.test(this.phone)) {
      this.errors['phone'] = this.getFormTextError().bad_phone;
    }
  }

  clearErrors() {
    this.errors = {};
  }

  isFormValid() {
    this.clearErrors();
    if (!this.isRegisterMode) {
      this.validateEmail();
      this.validatePassword();
    } else {
      this.validateForm();
    }
    return Object.keys(this.errors).length === 0;
  }

  toggleInput() {
    this.isRecruiter = !this.isRecruiter;
  }

  getFormTextError() {
    return {
      name_required: "O campo Nome é obrigatório.",
      small_name: "O Nome deve ter no mínimo 5 caracteres",
      email_required: "O campo Email é obrigatório.",
      invalid_email: "Email inválido.",
      password_required: "O campo Senha é obrigatório.",
      small_password: "A senha deve ter no mínimo 5 caracteres",
      bad_password: "A confirmação de senha não corresponde à senha digitada.",
      phone_required: "O campo Telefone é obrigatório.",
      bad_phone: "Telefone inválido"
    }
  }

  getFormText() {
    if (this.isRegisterMode) {
      return {
        label1: "Já possui uma conta ?",
        label2: "Entrar",
        btn: "Cadastrar",
        recruter: "Sou Recrutador",
      }
    } else {
      return {
        label1: "Não tem uma conta ?",
        label2: "Cadastre-se",
        btn: "Entrar",
        recruter: "Sou Candidato",
      }
    }
  }
}