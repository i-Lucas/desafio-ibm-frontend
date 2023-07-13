import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { DashboardRoutingModule } from 'src/app/routes/dashboard-routing.module';

import { FormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  providers: [MessageService],
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ToastModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
