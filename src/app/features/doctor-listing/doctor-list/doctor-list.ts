import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.css'
})
export class DoctorListComponent implements OnInit {
  allDoctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedSpecialty: string = '';

  specialties: string[] = ['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics'];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.allDoctors = data;
        this.filteredDoctors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching doctors', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.filteredDoctors = this.allDoctors.filter(doc => {
      const matchesName = doc.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSpecialty = this.selectedSpecialty === '' || doc.specialization === this.selectedSpecialty;
      return matchesName && matchesSpecialty;
    });
  }
}
