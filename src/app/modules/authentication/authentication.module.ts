import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from 'src/app/routes/authentication-routing.module';
import { AuthenticationComponent } from 'src/app/components/authentication/authentication.component';



@NgModule({
  declarations: [AuthenticationComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule
  ],
  exports: [AuthenticationComponent]
})
export class AuthenticationModule { }
