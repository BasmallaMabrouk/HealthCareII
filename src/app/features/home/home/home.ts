import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private animationId = 0;
  private particles: Particle[] = [];
  isVisible = false;

  specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics', 'Oncology'];
  currentSpecialtyIndex = 0;
  private specialtyInterval: any;

  portals = [
    {
      role: 'Patient',
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      features: ['Book Appointments', 'View Medical Records', 'Browse Specialists'],
      color: 'portal-patient',
      link: '/auth/register'
    },
    {
      role: 'Doctor',
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
      features: ['Manage Schedules', 'Patient Overview', 'Write Prescriptions'],
      color: 'portal-doctor',
      link: '/auth/login'
    },
    {
      role: 'Admin',
      icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      features: ['Manage Doctors', 'Manage Patients', 'Full Dashboard'],
      color: 'portal-admin',
      link: '/auth/login'
    }
  ];

  features = [
    {
      icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      title: 'Smart Scheduling',
      desc: 'Book with real-time slot availability. No waiting, no calls.',
    },
    {
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8',
      title: 'Medical Records',
      desc: 'Full history, diagnoses and prescriptions in one secure place.',
    },
    {
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      title: 'Top Specialists',
      desc: 'Filter doctors by specialty, rating and available slots.',
    },
    {
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      title: 'Secure & Private',
      desc: 'Encrypted data accessible only by you and your doctor.',
    },
  ];

  ngOnInit(): void {
    setTimeout(() => this.isVisible = true, 80);
    this.specialtyInterval = setInterval(() => {
      this.currentSpecialtyIndex = (this.currentSpecialtyIndex + 1) % this.specialties.length;
    }, 1900);
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    clearInterval(this.specialtyInterval);
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 45; i++) this.particles.push(new Particle(canvas.width, canvas.height));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach(p => { p.update(canvas.width, canvas.height); p.draw(ctx); });
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }
}

class Particle {
  x: number; y: number; vx: number; vy: number; size: number; opacity: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.35; this.vy = (Math.random() - 0.5) * 0.35;
    this.size = Math.random() * 2 + 0.5; this.opacity = Math.random() * 0.25 + 0.06;
  }
  update(w: number, h: number) {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(155, 114, 176, ${this.opacity})`;
    ctx.fill();
  }
}
