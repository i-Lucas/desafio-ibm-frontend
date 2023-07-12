import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiResponseLogin } from 'src/app/interfaces/ApiResponse';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})

export class AuthenticationComponent {

  name: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  phone: string = "";
  company: string = "";
  errors: { [key: string]: string } = {};

  isRecruiter: boolean = false;
  isRegisterMode: boolean = false;

  constructor(private messageService: MessageService, private authService: AuthenticationService) { }

  submit() {

    console.log(this.errors)

    if (this.isFormValid()) {

      this.authService.signIn({ email: this.email, password: this.password }).subscribe({
        next: this.handleSuccessResponse,
        error: this.handleErrorResponse,
        complete: this.handleComplete
      })

    } else {
      this.catchError();
    }
  }

  private handleSuccessResponse = (response: ApiResponseLogin): void => {
    // this.isLoading = false;
    console.log(response.token);
    this.showSuccess();
  };

  private handleErrorResponse = (error: any): void => {
    console.log(error);
    // this.isLoading = false;
  };

  private handleComplete = (): void => {
    // if (!environment.production) {
    console.log('Requisição concluída com sucesso!');
    alert("logado com sucesso");
    // }
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

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Bem Vindo username'
    });
  }

  showError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail
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

/*

{
  "name": "Lucas",
  "email": "lucas@dev.com",
  "password": "8896",
  "company": "imb",
  "phone": "71999333511",
  "role": "RECRUITER"
}
*/