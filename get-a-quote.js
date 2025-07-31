// This script will now only handle tab activation on the contact page
document.addEventListener('DOMContentLoaded', function() {
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) {
        // If the URL has the '#booking-form' hash, activate the booking tab
        if (window.location.hash === '#booking-form') {
            var bookingTab = document.querySelector('.booking__tab[data-tab="booking"]');
            if (bookingTab) {
                bookingTab.click();
            }
        }
    }
});

// You can remove the old event listener for the button since it's now an <a> tag
// The browser's default behavior for the anchor link will handle the redirect.