// ============================================
// FURNITURE MALL - MAIN JAVASCRIPT
// ============================================

// Cache DOM elements for better performance
const header = document.querySelector('.site-header');
const scrollTopBtn = document.querySelector('.scroll-top');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

// ============================================
// HEADER SCROLL EFFECT
// ============================================
let lastScrollY = window.scrollY;

const handleScroll = () => {
  const scrollY = window.scrollY;
  
  // Add scrolled class for header styling
  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Show/hide scroll to top button
  if (scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
  
  lastScrollY = scrollY;
};

// Throttled scroll event listener (runs every 50ms max)
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) return;
  scrollTimeout = setTimeout(() => {
    handleScroll();
    scrollTimeout = null;
  }, 50);
});

// Run on page load
window.addEventListener('load', handleScroll);

// ============================================
// MOBILE MENU TOGGLE
// ============================================
if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// LAZY LOAD IMAGES
// ============================================
const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger load
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.src;
      img.classList.add('loaded');
    });
  }
};

// Run lazy load on page load
window.addEventListener('load', lazyLoadImages);

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observeElements = () => {
  const animatedElements = document.querySelectorAll('.category-card, .feature-item, .about-content, .about-image');
  
  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Set initial state for animated elements
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
};

// Run on page load
window.addEventListener('load', observeElements);

// ============================================
// ACTIVE NAV LINK HIGHLIGHT
// ============================================
const updateActiveNavLink = () => {
  const currentPath = window.location.pathname;
  const navLinksArray = document.querySelectorAll('.nav-links a');
  
  navLinksArray.forEach(link => {
    link.classList.remove('active');
    const linkPath = new URL(link.href).pathname;
    
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
};

// Run on page load
window.addEventListener('load', updateActiveNavLink);

// ============================================
// PERFORMANCE: Reduce Motion for Users Who Prefer It
// ============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  
  // Disable animations
  const style = document.createElement('style');
  style.textContent = `
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log(
  '%c🪑 Furniture Mall',
  'font-size: 20px; font-weight: bold; color: #10B981;'
);
console.log(
  '%cPremium furniture for your home and office',
  'font-size: 14px; color: #6B7280;'
);

// ============================================
// EXPORT FOR TESTING (IF NEEDED)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleScroll,
    lazyLoadImages,
    observeElements,
    updateActiveNavLink
  };
}