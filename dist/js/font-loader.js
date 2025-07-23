// Font loading optimization
const fontLoader = {
  init() {
    // Check if fonts are already cached
    if (sessionStorage.fontsLoaded) {
      document.documentElement.classList.add('fonts-loaded');
      return;
    }

    // Load fonts asynchronously
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    fontLink.onload = () => {
      document.documentElement.classList.add('fonts-loaded');
      sessionStorage.fontsLoaded = true;
    };
    document.head.appendChild(fontLink);
  }
};

// Initialize font loader
fontLoader.init(); 