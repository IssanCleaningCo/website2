// Video Optimization Script
document.addEventListener('DOMContentLoaded', function() {
  // Get all video elements
  const videos = document.querySelectorAll('video');
  
  // Create Intersection Observer for videos
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
});

// Preload critical videos (like hero videos)
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