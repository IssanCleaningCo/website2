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
const heroMessages = [
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
];

// Function to set random hero message
function setRandomHeroMessage() {
    const randomIndex = Math.floor(Math.random() * heroMessages.length);
    const message = heroMessages[randomIndex];
    
    const titleElement = document.querySelector('.main__title');
    const textElement = document.querySelector('.main__text');
    
    if (titleElement && textElement) {
        titleElement.textContent = message.title;
        textElement.textContent = message.text;
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', setRandomHeroMessage);
