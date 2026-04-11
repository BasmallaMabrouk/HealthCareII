import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import lottie from 'lottie-web';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayoutComponent implements OnInit {
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      if (this.lottieContainer) {
        lottie.loadAnimation({
          container: this.lottieContainer.nativeElement,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/assets/health.json'
        });
      }
    }, 100);
  }
}
