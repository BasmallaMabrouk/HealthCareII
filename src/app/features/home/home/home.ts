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
      // ── NEW creative additions ──
      this.setupFloatingMedicalIcons();
      this.setupBgGrid();
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

  /* ══════════════════════════════════════════════════════════════
     FLOATING MEDICAL ICONS  — 6 SVG icons with unique orbit paths
  ══════════════════════════════════════════════════════════════ */
  private setupFloatingMedicalIcons(): void {
    const container = this.el.nativeElement.querySelector('.floating-icons') as HTMLElement;
    if (!container) return;

    // Each icon: { svg markup, size px, top%, left%, initial rotation }
    const icons = [
      {
        size: 44,
        top: 18, left: 12,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>`  // clock
      },
      {
        size: 52,
        top: 60, left: 6,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>`  // ECG/activity
      },
      {
        size: 40,
        top: 30, left: 82,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>`  // shield
      },
      {
        size: 48,
        top: 72, left: 75,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>`  // heart
      },
      {
        size: 38,
        top: 12, left: 55,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>`  // plus / cross
      },
      {
        size: 50,
        top: 80, left: 40,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
        </svg>`  // calendar
      }
    ];

    icons.forEach((icon) => {
      const wrapper    = document.createElement('div');
      wrapper.className = 'float-icon';
      wrapper.innerHTML = icon.svg;
      wrapper.style.cssText = `
        width:  ${icon.size}px;
        height: ${icon.size}px;
        top:    ${icon.top}%;
        left:   ${icon.left}%;
      `;
      container.appendChild(wrapper);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     ANIMATED BACKGROUND GRID  — dots + lines that randomly glow
  ══════════════════════════════════════════════════════════════ */
  private setupBgGrid(): void {
    const grid = this.el.nativeElement.querySelector('.bg-grid') as HTMLElement;
    if (!grid) return;

    const cols = 9;
    const rows = 5;

    // Horizontal lines
    for (let r = 1; r < rows; r++) {
      const line    = document.createElement('div');
      line.className = 'grid-line-h';
      line.style.top = `${(r / rows) * 100}%`;
      grid.appendChild(line);
    }
    // Vertical lines
    for (let c = 1; c < cols; c++) {
      const line    = document.createElement('div');
      line.className = 'grid-line-v';
      line.style.left = `${(c / cols) * 100}%`;
      grid.appendChild(line);
    }
    // Glowing nodes at intersections
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const node    = document.createElement('div');
        node.className = 'grid-node';
        node.style.top       = `calc(${(r / rows) * 100}% - 1.5px)`;
        node.style.left      = `calc(${(c / cols) * 100}% - 1.5px)`;
        node.style.animationDelay    = `${Math.random() * 6}s`;
        node.style.animationDuration = `${Math.random() * 3 + 3}s`;
        grid.appendChild(node);
      }
    }
  }

  /* ── Navigation ─────────────────────────────────────────────── */
  goToLogin()    { this.router.navigate(['/auth/login']); }
  goToRegister() { this.router.navigate(['/auth/register']); }
}
