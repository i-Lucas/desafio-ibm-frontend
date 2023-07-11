import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from 'src/app/routes/authentication-routing.module';
import { AuthenticationComponent } from 'src/app/components/authentication/authentication.component';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [AuthenticationComponent],
  providers: [MessageService],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    InputSwitchModule
  ],
  exports: [AuthenticationComponent]
})

export class AuthenticationModule { }
