# Spanish "¡Cotiza aquí!" Button Fix

## Problem Identified
The "¡Cotiza aquí!" button on Spanish pages was not properly activating the booking form tab when users clicked it, unlike the English "Get a quote" button.

## Root Cause
The Spanish contact page (`es/contacto.html`) was missing the JavaScript functionality needed to:
1. Detect the `#booking-form` hash in the URL
2. Automatically switch to the booking tab when the hash is present
3. Handle tab switching interactions

## Solution Implemented

### 1. Added Tab Switching JavaScript
Added comprehensive JavaScript to `es/contacto.html` that includes:

```javascript
// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.booking__tab');
    const panels = document.querySelectorAll('.booking__panel');
    
    // Set minimum date to today for the date picker
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // If the URL has the '#booking-form' hash, activate the contact tab and scroll to section
    if (window.location.hash === '#booking-form') {
        const contactTab = document.querySelector('.booking__tab[data-tab="contact"]');
        const bookingSection = document.getElementById('booking-form');
        if (contactTab) {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            contactTab.classList.add('active');
            document.getElementById('contact-panel').classList.add('active');
        }
        // Scroll to the booking section
        if (bookingSection) {
            setTimeout(() => {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    // Add click handlers for tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-panel`).classList.add('active');
        });
    });
});
```

### 2. Enhanced Test Page
Updated `spanish-header-test.html` with a test script to verify the functionality works.

## How It Works Now

1. **User clicks "¡Cotiza aquí!" on any Spanish page**
2. **Browser navigates to `/es/contacto.html#booking-form`**
3. **JavaScript detects the `#booking-form` hash**
4. **Automatically activates "Formulario de Contacto" tab**
5. **Scrolls smoothly to the forms section**
6. **User sees the contact form ready to fill out**

## Files Modified
- ✅ `es/contacto.html` - Added tab switching JavaScript functionality
- ✅ `spanish-header-test.html` - Added test functionality

## Testing Instructions
1. Navigate to any Spanish page
2. Click the "¡Cotiza aquí!" button
3. Verify you land on the Spanish contact page and automatically scroll to the forms section
4. Verify the "Formulario de Contacto" tab is active
5. The contact form should be visible and ready to use

## Verification
The fix ensures that users get appropriate forms based on their needs:
- **English**: "Get a quote" → Contact page with booking tab active (detailed booking)
- **Spanish**: "¡Cotiza aquí!" → Contact page with "Formulario de Contacto" tab active (quick inquiry)

The Spanish version prioritizes the simpler contact form for quick quote requests!
