import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/components/navbar/sidebar';

@Component({
  selector: 'app-patient',
  imports: [RouterModule, Sidebar],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.css',
})
export class Patient {}
