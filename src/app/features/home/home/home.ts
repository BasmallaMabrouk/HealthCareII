


import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router }       from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  /* ── Typewriter ─────────────────────────────────────────────── */
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

  /* ── Stats ─────────────────────────────────────────────────── */
  stats = [
    { label: 'Doctors',      target: 120,  current: 0, suffix: '+' },
    { label: 'Patients',     target: 5000, current: 0, suffix: '+' },
    { label: 'Appointments', target: 98,   current: 0, suffix: '%', note: 'satisfaction' },
    { label: 'Specialties',  target: 24,   current: 0, suffix: '' }
  ];
  private statsAnimated = false;

  /* ── Features ──────────────────────────────────────────────── */
  features = [
    { icon: 'calendar', title: 'Easy Booking',
      desc: 'Schedule appointments with top specialists in just a few taps.' },
    { icon: 'shield',   title: 'Secure Records',
      desc: 'Your medical history is always safe, private, and accessible.' },
    { icon: 'clock',    title: '24/7 Access',
      desc: 'Manage your health anytime, anywhere — no waiting rooms.' },
    { icon: 'star',     title: 'Top Specialists',
      desc: 'Connect with verified, highly-rated doctors across all fields.' }
  ];

  /* ── Internals ─────────────────────────────────────────────── */
  private observers : IntersectionObserver[] = [];
  private cleanups  : (() => void)[]         = [];

  constructor(
    private router : Router,
    private el     : ElementRef,
    private ngZone : NgZone
  ) {}

  /* ══════════════════════════════════════════════════════════════
     LIFECYCLE
  ══════════════════════════════════════════════════════════════ */
  ngOnInit(): void {
    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    // Run all DOM interactions outside Angular for max performance
    this.ngZone.runOutsideAngular(() => {
      this.setupCustomCursor();
      this.setupScrollProgress();
      this.setupNavScrollEffect();
      this.setupScrollReveal();
      this.setupStatsTrigger();
      this.setupHeroCard3DTilt();
      this.setupHeroSpotlight();
      this.setupParticles();
      this.setupMagneticButtons();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.observers.forEach(o => o.disconnect());
    this.cleanups.forEach(fn => fn());
  }

  /* ══════════════════════════════════════════════════════════════
     CUSTOM CURSOR  — smooth lagging trail
  ══════════════════════════════════════════════════════════════ */
  private setupCustomCursor(): void {
    const dot     = this.el.nativeElement.querySelector('.cursor-dot')     as HTMLElement;
    const outline = this.el.nativeElement.querySelector('.cursor-outline') as HTMLElement;
    if (!dot || !outline) return;

    let mouseX = -200, mouseY = -200;
    let outX = -200, outY = -200;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    };

    const animate = () => {
      outX += (mouseX - outX) * 0.13;
      outY += (mouseY - outY) * 0.13;
      outline.style.left = Math.round(outX) + 'px';
      outline.style.top  = Math.round(outY) + 'px';
      rafId = requestAnimationFrame(animate);
    };

    animate();
    document.addEventListener('mousemove', onMove);

    // Grow cursor on interactive elements
    const interactives = this.el.nativeElement.querySelectorAll(
      'button, a, .feature-card, .step, .pill, .appt-item'
    );

    interactives.forEach((el: Element) => {
      const grow  = () => { dot.classList.add('cursor-grow');    outline.classList.add('cursor-grow'); };
      const shrink = () => { dot.classList.remove('cursor-grow'); outline.classList.remove('cursor-grow'); };
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    this.cleanups.push(
      () => document.removeEventListener('mousemove', onMove),
      () => cancelAnimationFrame(rafId)
    );
  }

  /* ══════════════════════════════════════════════════════════════
     SCROLL PROGRESS BAR
  ══════════════════════════════════════════════════════════════ */
  private setupScrollProgress(): void {
    const bar = this.el.nativeElement.querySelector('.scroll-progress-bar') as HTMLElement;
    if (!bar) return;

    const onScroll = () => {
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = progress + '%';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanups.push(() => window.removeEventListener('scroll', onScroll));
  }

  /* ══════════════════════════════════════════════════════════════
     NAVBAR SCROLL SHADOW
  ══════════════════════════════════════════════════════════════ */
  private setupNavScrollEffect(): void {
    const nav = this.el.nativeElement.querySelector('.home-nav') as HTMLElement;
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanups.push(() => window.removeEventListener('scroll', onScroll));
  }

  /* ══════════════════════════════════════════════════════════════
     SCROLL REVEAL  — IntersectionObserver
  ══════════════════════════════════════════════════════════════ */
  private setupScrollReveal(): void {
    const els = this.el.nativeElement.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el: Element) => observer.observe(el));
    this.observers.push(observer);
  }

  /* ══════════════════════════════════════════════════════════════
     STATS COUNTER  — triggered by scroll
  ══════════════════════════════════════════════════════════════ */
  private setupStatsTrigger(): void {
    const section = this.el.nativeElement.querySelector('.stats-section');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.ngZone.run(() => this.animateStats());
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    this.observers.push(observer);
  }

  /* ══════════════════════════════════════════════════════════════
     3D CARD TILT  — mouse parallax on hero visual
  ══════════════════════════════════════════════════════════════ */
  private setupHeroCard3DTilt(): void {
    const visual = this.el.nativeElement.querySelector('.hero-visual')  as HTMLElement;
    const card   = this.el.nativeElement.querySelector('.visual-card')  as HTMLElement;
    if (!visual || !card) return;

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = visual.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);   // -1 .. 1
        const dy   = (e.clientY - cy) / (rect.height / 2);   // -1 .. 1

        const rotX = -dy * 14;
        const rotY =  dx * 14;

        card.style.animation   = 'none';  // pause float
        card.style.transform   = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
        card.style.transition  = 'transform 0.08s linear';
        card.style.boxShadow   = `
          ${-dx * 12}px ${-dy * 12}px 40px rgba(92,45,110,0.18),
          0 20px 60px rgba(92,45,110,0.12)
        `;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafId);
      card.style.transition  = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), box-shadow 0.7s ease';
      card.style.transform   = '';
      card.style.boxShadow   = '';
      // Re-enable float after transition
      setTimeout(() => { card.style.animation = ''; card.style.transition = ''; }, 700);
    };

    visual.addEventListener('mousemove', onMove);
    visual.addEventListener('mouseleave', onLeave);

    this.cleanups.push(
      () => visual.removeEventListener('mousemove', onMove),
      () => visual.removeEventListener('mouseleave', onLeave),
      () => cancelAnimationFrame(rafId)
    );
  }

  /* ══════════════════════════════════════════════════════════════
     HERO SPOTLIGHT  — radial glow follows cursor
  ══════════════════════════════════════════════════════════════ */
  private setupHeroSpotlight(): void {
    const hero      = this.el.nativeElement.querySelector('.hero-section') as HTMLElement;
    const spotlight = this.el.nativeElement.querySelector('.hero-spotlight') as HTMLElement;
    if (!hero || !spotlight) return;

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        spotlight.style.background =
          `radial-gradient(650px circle at ${x}px ${y}px, rgba(196,168,216,0.09) 0%, transparent 65%)`;
      });
    };

    hero.addEventListener('mousemove', onMove);
    this.cleanups.push(
      () => hero.removeEventListener('mousemove', onMove),
      () => cancelAnimationFrame(rafId)
    );
  }

  /* ══════════════════════════════════════════════════════════════
     FLOATING PARTICLES  — created programmatically
  ══════════════════════════════════════════════════════════════ */
  private setupParticles(): void {
    const container = this.el.nativeElement.querySelector('.particles-container') as HTMLElement;
    if (!container) return;

    const count = 30;

    for (let i = 0; i < count; i++) {
      const p    = document.createElement('div');
      const size = Math.random() * 4 + 2;           // 2-6px
      p.className = 'particle';
      p.style.cssText = `
        left:              ${Math.random() * 100}%;
        top:               ${Math.random() * 100}%;
        width:             ${size}px;
        height:            ${size}px;
        animation-delay:   ${Math.random() * 10}s;
        animation-duration:${Math.random() * 8 + 10}s;
        opacity:           ${Math.random() * 0.4 + 0.1};
      `;
      container.appendChild(p);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     MAGNETIC BUTTONS  — subtle pull toward cursor
  ══════════════════════════════════════════════════════════════ */
  private setupMagneticButtons(): void {
    const buttons = this.el.nativeElement.querySelectorAll('.cta-primary, .nav-signup-btn');

    buttons.forEach((btn: HTMLElement) => {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);
        btn.style.transform   = `translate(${dx * 7}px, ${dy * 7}px)`;
        btn.style.transition  = 'transform 0.15s ease';
      };

      const onLeave = () => {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        btn.style.transform  = '';
      };

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);

      this.cleanups.push(
        () => btn.removeEventListener('mousemove', onMove),
        () => btn.removeEventListener('mouseleave', onLeave)
      );
    });
  }

  /* ══════════════════════════════════════════════════════════════
     TYPEWRITER
  ══════════════════════════════════════════════════════════════ */
  private startTypewriter(): void {
    const target = this.phrases[this.phraseIndex];

    if (this.typing) {
      if (this.charIndex < target.length) {
        this.currentPhrase += target[this.charIndex++];
        this.timer = setTimeout(() => this.startTypewriter(), 60);
      } else {
        this.typing = false;
        this.timer  = setTimeout(() => this.startTypewriter(), 1800);
      }
    } else {
      if (this.charIndex > 0) {
        this.currentPhrase = target.slice(0, --this.charIndex);
        this.timer = setTimeout(() => this.startTypewriter(), 30);
      } else {
        this.typing      = true;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        this.timer       = setTimeout(() => this.startTypewriter(), 300);
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
     STATS COUNTER ANIMATION
  ══════════════════════════════════════════════════════════════ */
  private animateStats(): void {
    this.stats.forEach((stat, i) => {
      const duration  = 1800;
      const steps     = 60;
      const increment = stat.target / steps;
      let   step      = 0;

      // Ease-out using easing function
      const interval = setInterval(() => {
        step++;
        const progress    = step / steps;
        const eased       = 1 - Math.pow(1 - progress, 3);        // cubic ease-out
        stat.current      = Math.min(Math.round(stat.target * eased), stat.target);
        if (step >= steps) clearInterval(interval);
      }, (duration + i * 150) / steps);
    });
  }

  /* ── Navigation ─────────────────────────────────────────────── */
  goToLogin()    { this.router.navigate(['/auth/login']); }
  goToRegister() { this.router.navigate(['/auth/register']); }
}
