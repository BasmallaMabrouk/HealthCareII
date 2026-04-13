import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Typewriter effect
  phrases = [
    'Book your doctor in seconds.',
    'Track your medical records.',
    'Your health, our priority.',
    'Care that comes to you.'
  ];
  currentPhrase = '';
  private phraseIndex = 0;
  private charIndex   = 0;
  private typing      = true;
  private timer: any;

  // Animated stats counters
  stats = [
    { label: 'Doctors',      target: 120, current: 0, suffix: '+' },
    { label: 'Patients',     target: 5000, current: 0, suffix: '+' },
    { label: 'Appointments', target: 98,  current: 0, suffix: '%', note: 'satisfaction' },
    { label: 'Specialties',  target: 24,  current: 0, suffix: '' }
  ];

  // Features
  features = [
    {
      icon: 'calendar',
      title: 'Easy Booking',
      desc: 'Schedule appointments with top specialists in just a few taps.'
    },
    {
      icon: 'shield',
      title: 'Secure Records',
      desc: 'Your medical history is always safe, private, and accessible.'
    },
    {
      icon: 'clock',
      title: '24/7 Access',
      desc: 'Manage your health anytime, anywhere — no waiting rooms.'
    },
    {
      icon: 'star',
      title: 'Top Specialists',
      desc: 'Connect with verified, highly-rated doctors across all fields.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTypewriter();
    this.animateStats();
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  private startTypewriter() {
    const target = this.phrases[this.phraseIndex];

    if (this.typing) {
      if (this.charIndex < target.length) {
        this.currentPhrase += target[this.charIndex++];
        this.timer = setTimeout(() => this.startTypewriter(), 60);
      } else {
        this.typing = false;
        this.timer = setTimeout(() => this.startTypewriter(), 1800);
      }
    } else {
      if (this.charIndex > 0) {
        this.currentPhrase = target.slice(0, --this.charIndex);
        this.timer = setTimeout(() => this.startTypewriter(), 30);
      } else {
        this.typing = true;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        this.timer = setTimeout(() => this.startTypewriter(), 300);
      }
    }
  }

  private animateStats() {
    this.stats.forEach((stat, i) => {
      const duration = 1800;
      const steps    = 60;
      const increment = stat.target / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        stat.current = Math.min(Math.round(increment * step), stat.target);
        if (step >= steps) clearInterval(interval);
      }, (duration + i * 200) / steps);
    });
  }

  goToLogin()    { this.router.navigate(['/auth/login']); }
  goToRegister() { this.router.navigate(['/auth/register']); }
}