// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const iconMenu = document.querySelector('.icon-menu');
  
  if (iconMenu) {
    iconMenu.addEventListener('click', function(e) {
      document.body.classList.toggle('menu-open');
      e.preventDefault();
    });
  }

  // Close menu when clicking a link
  const menuLinks = document.querySelectorAll('.menu__link');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.header__navigation') && !e.target.closest('.icon-menu')) {
      document.body.classList.remove('menu-open');
    }
  });

  // Set active state for mobile navigation
  const currentPath = window.location.pathname;
  const mobileNavItems = document.querySelectorAll('.mobile-nav__item');
  
  mobileNavItems.forEach(item => {
    if (item.getAttribute('href') === currentPath.split('/').pop()) {
      item.classList.add('active');
    }
  });

  // Optimize animations with requestAnimationFrame
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) {
    requestAnimationFrame(() => {
      mobileNav.style.transform = 'translateY(0)';
    });
  }

  // Add touch ripple effect
  mobileNavItems.forEach(item => {
    item.addEventListener('touchstart', function(e) {
      const rect = item.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = `${e.touches[0].clientX - rect.left}px`;
      ripple.style.top = `${e.touches[0].clientY - rect.top}px`;
      item.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.testimonial__slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Click handlers for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
  });

  // Auto-advance slides
  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  // Initialize
  showSlide(0);
  startSlideShow();

  // Pause on hover
  const slider = document.querySelector('.testimonial__slider');
  slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slider.addEventListener('mouseleave', startSlideShow);
});

// Booking System Tabs
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.booking__tab');
  const panels = document.querySelectorAll('.booking__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active class to clicked tab and corresponding panel
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-panel`).classList.add('active');
    });
  });

  // Booking Form Submission
  function sendBooking(e) {
    e.preventDefault();
    
    const form = document.getElementById('booking-form');
    const templateParams = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      service: form.service.value,
      size: form.size.value,
      bedrooms: form.bedrooms.value,
      bathrooms: form.bathrooms.value,
      date: form.date.value,
      time: form.time.value,
      notes: form.notes.value
    };

    emailjs.send('service_6cikdqq', 'template_rsq8lj2', templateParams)
      .then(
        function(response) {
          console.log("SUCCESS", response);
          alert("Booking request sent successfully! We'll contact you shortly to confirm.");
          form.reset();
        },
        function(error) {
          console.log("FAILED", error);
          alert("Failed to send booking request. Please try again.");
        }
      );

    return false;
  }
});

// Floating Header
document.addEventListener('DOMContentLoaded', function() {
  let lastScroll = 0;
  const header = document.querySelector('.header');
  const scrollThreshold = 100; // Amount of scroll before hiding header

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      // At the top
      header.classList.remove('header--hidden');
      return;
    }

    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      // Scrolling down & past threshold
      header.classList.add('header--hidden');
    } else if (currentScroll < lastScroll) {
      // Scrolling up
      header.classList.remove('header--hidden');
    }

    lastScroll = currentScroll;
  });
});

// Service Checklist Toggle
document.addEventListener('DOMContentLoaded', function() {
  const serviceSelect = document.getElementById('booking-service');
  const checklist = document.getElementById('service-checklist');
  const checklistContents = document.querySelectorAll('.checklist-content');

  if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
      const selectedService = this.value;
      
      // Hide all checklists first
      checklistContents.forEach(content => content.classList.add('hidden'));
      
      if (selectedService) {
        // Show the checklist section
        checklist.classList.remove('hidden');
        // Show the specific checklist for the selected service
        const selectedChecklist = document.querySelector(`[data-service="${selectedService}"]`);
        if (selectedChecklist) {
          selectedChecklist.classList.remove('hidden');
        }
      } else {
        // Hide the checklist section if no service is selected
        checklist.classList.add('hidden');
      }
    });
  }
});

// Add this to your script.js
const heroMessages = {
    en: [
        {
            title: "Come Home to Perfect",
            text: "Imagine walking into your spotless home, leaving stress at the door, and simply enjoying your space. We handle the cleaning, so you can focus on living."
        },
        {
            title: "Your Sanctuary Awaits",
            text: "There's nothing quite like stepping into a freshly cleaned home. Let us create that moment of pure relaxation for you, where cleaning is the last thing on your mind."
        },
        {
            title: "Relax. It's Done.",
            text: "Experience the bliss of coming home to a perfectly cleaned space. No chores, no stress – just the pure joy of a pristine home ready for you to enjoy."
        }
    ],
    es: [
        {
            title: "Llegue a un Hogar Perfecto",
            text: "Imagine entrar a su casa impecable, dejando la ansiedad en la puerta y simplemente disfrutando de su espacio."
        },
        {
            title: "Su Santuario le Espera",
            text: "No hay nada como llegar a una casa recién limpia. Dejemos que nosotros creamos ese momento de pureza para ti, donde la limpieza es la última cosa en tu mente."
        },
        {
            title: "Relájese. Ya Está Hecho.",
            text: "Experimente la felicidad de llegar a un espacio perfectamente limpio. No hay tareas, no ansiedad – solo la felicidad pura de una casa limpia lista para disfrutar."
        }
    ]
};

// Function to set random hero message (only on home page)
function setRandomHeroMessage() {
     // Check if we're on the home page (either English or Spanish)
     if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('es/index.html')) {
      // Determine language based on URL
      const isSpanish = window.location.pathname.includes('/es/');
      const messages = isSpanish ? heroMessages.es : heroMessages.en;
      
      const randomIndex = Math.floor(Math.random() * messages.length);
      const message = messages[randomIndex];
      
      const titleElement = document.querySelector('.main__title');
      const textElement = document.querySelector('.main__text');
      
      if (titleElement && textElement) {
          titleElement.textContent = message.title;
          textElement.textContent = message.text;
      }
  }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', setRandomHeroMessage);

// Add lazy loading and optimize images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
        // Only apply lazy loading to non-critical images
        if (img.classList.contains('logo') || 
            img.closest('.header') || 
            img.closest('.services__item') || 
            img.closest('.about__image')) {
            img.loading = 'eager'; // Load immediately
            img.decoding = 'sync';  // Decode synchronously
        } else {
            img.loading = 'lazy';
            img.decoding = 'async';
        }
    });

    // Optimize video loading
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.preload = 'auto'; // Preload video for smoother playback
        // Only load video when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });
        observer.observe(video);
    });
});

// Video Optimization - Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
  const videos = document.querySelectorAll('video');
  
  if (videos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        
        if (entry.isIntersecting) {
          // Video is visible - load and play
          if (video.dataset.src) {
            video.src = video.dataset.src;
            video.removeAttribute('data-src');
          }
          
          // Add poster image if not already set
          if (!video.poster && video.dataset.poster) {
            video.poster = video.dataset.poster;
          }
          
          // Play video if it has autoplay attribute
          if (video.hasAttribute('autoplay')) {
            video.play().catch(e => console.log('Video autoplay prevented:', e));
          }
          
          // Stop observing this video
          videoObserver.unobserve(video);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before video comes into view
      threshold: 0.1
    });
    
    // Process each video
    videos.forEach(video => {
      // Store original src in data attribute
      if (video.src) {
        video.dataset.src = video.src;
        video.removeAttribute('src');
      }
      
      // Set preload to none to prevent loading until visible
      video.preload = 'none';
      
      // Add loading class for styling
      video.classList.add('video-lazy');
      
      // Start observing
      videoObserver.observe(video);
    });
  }
});

// Preload critical videos
function preloadCriticalVideos() {
  const criticalVideos = [
    'videos/cleaning.mp4',
    'videos/home.mp4'
  ];
  
  criticalVideos.forEach(videoSrc => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = videoSrc;
    document.head.appendChild(link);
  });
}

// Call preload for critical videos
preloadCriticalVideos();

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll handler
const optimizedScroll = debounce(() => {
    const currentScroll = window.pageYOffset;
    // ... rest of scroll logic
}, 16);

// Use Intersection Observer for scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe elements that need scroll animations
document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
    scrollObserver.observe(el);
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = performance.getEntriesByType('navigation')[0];
        console.log(`Page Load Time: ${timing.loadEventEnd - timing.navigationStart}ms`);
    });
}

// Monitor and log performance metrics
if ('performance' in window && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        });
    });
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
}

// Debounce form submissions
function debounceSubmit(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply to form submissions
const debouncedSubmit = debounceSubmit((e) => {
    sendEmail(e);
}, 300);

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}
