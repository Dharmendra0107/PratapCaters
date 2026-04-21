/* ============================================================
   Royal Dastarkhwan – Premium Catering Website
   Main JavaScript File
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. AOS INIT ── */
  AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80
  });

  /* ── 2. NAVBAR SCROLL BEHAVIOUR ── */
  const navbar = document.getElementById('mainNavbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky navbar style
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top visibility
    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  /* ── 3. SCROLL TO TOP ── */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 4. SMOOTH SCROLL FOR NAV LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        // Close mobile menu
        const navMenu = document.getElementById('navMenu');
        const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  /* ── 5. ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  /* ── 6. COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  const statsSection = document.querySelector('.stats-bar');
  let counterTriggered = false;

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counterTriggered) {
      counterTriggered = true;
      document.querySelectorAll('.stat-number').forEach(animateCounter);
    }
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);

  /* ── 7. GALLERY FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── 8. GLIGHTBOX INIT ── */
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    openEffect: 'zoom',
    closeEffect: 'fade'
  });

  /* ── 9. CONTACT FORM VALIDATION & SUBMIT ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      // Clear previous validation
      contactForm.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
      });

      // Validate required fields
      const requiredFields = ['name', 'phone', 'eventType', 'guests'];
      requiredFields.forEach(id => {
        const field = document.getElementById(id);
        if (!field || !field.value.trim()) {
          field.classList.add('is-invalid');
          valid = false;
        } else {
          field.classList.add('is-valid');
        }
      });

      // Phone validation
      const phone = document.getElementById('phone');
      const phoneVal = phone ? phone.value.trim() : '';
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,9}$/;
      if (phone && phoneVal && !phoneRegex.test(phoneVal.replace(/\s/g, ''))) {
        phone.classList.add('is-invalid');
        phone.classList.remove('is-valid');
        valid = false;
      }

      // Email validation (optional field)
      const emailField = document.getElementById('email');
      const emailVal = emailField ? emailField.value.trim() : '';
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        emailField.classList.add('is-invalid');
        valid = false;
      }

      if (!valid) return;

      // Show loader
      btnText.classList.add('d-none');
      btnLoader.classList.remove('d-none');
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        btnText.classList.remove('d-none');
        btnLoader.classList.add('d-none');
        submitBtn.disabled = false;

        contactForm.classList.add('d-none');
        formSuccess.classList.remove('d-none');

        // Reset after 6 seconds
        setTimeout(() => {
          contactForm.reset();
          contactForm.querySelectorAll('.form-control').forEach(f => f.classList.remove('is-valid'));
          contactForm.classList.remove('d-none');
          formSuccess.classList.add('d-none');
        }, 6000);
      }, 1800);
    });
  }

  /* ── 10. NAVBAR HAMBURGER ANIMATION ── */
  const toggler = document.querySelector('.navbar-toggler');
  const navMenu = document.getElementById('navMenu');

  if (toggler && navMenu) {
    navMenu.addEventListener('show.bs.collapse', () => {
      toggler.classList.add('active');
    });
    navMenu.addEventListener('hide.bs.collapse', () => {
      toggler.classList.remove('active');
    });
  }

  /* ── 11. HERO CAROUSEL PARALLAX EFFECT ── */
  // Subtle parallax on hero content
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    heroCarousel.addEventListener('slide.bs.carousel', function (e) {
      // Fade out current slide content briefly
    });
  }

  /* ── 12. SCROLL REVEAL FOR GALLERY ON FILTER ── */
  // Re-trigger AOS when items become visible
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => AOS.refresh(), 50);
    });
  });

  /* ── 13. LAZY LOAD IMAGES ── */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  /* ── 14. SMOOTH HOVER EFFECTS FOR SERVICE CARDS ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.zIndex = '2';
    });
    card.addEventListener('mouseleave', function () {
      this.style.zIndex = '';
    });
  });

  /* ── 15. DATE INPUT MIN (Today) ── */
  const eventDateInput = document.getElementById('eventDate');
  if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);
  }

  console.log('%c🍽️ Royal Dastarkhwan – Serving Happiness with Every Bite', 'color: #C9A84C; font-size: 14px; font-weight: bold;');

});
