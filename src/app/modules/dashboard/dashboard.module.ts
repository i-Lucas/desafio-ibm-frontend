import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { DashboardRoutingModule } from 'src/app/routes/dashboard-routing.module';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  providers: [MessageService],
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ToastModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
