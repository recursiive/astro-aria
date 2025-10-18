// View tracking utility for blog posts
class ViewTracker {
  constructor(slug) {
    this.slug = slug;
    this.hasTracked = false;
    this.init();
  }

  async init() {
    // Always load current view count first
    await this.updateViewCount();
    
    // Only track if we haven't already for this session
    if (this.hasTracked) return;
    
    // Check if we've already tracked this view in localStorage (persists across sessions)
    const storageKey = `view_tracked_${this.slug}`;
    const lastTracked = localStorage.getItem(storageKey);
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // Track view if:
    // 1. Never tracked before, OR
    // 2. Last tracked more than 1 hour ago (allow re-tracking after time interval)
    if (!lastTracked || (Date.now() - parseInt(lastTracked)) > oneHour) {
      await this.trackView();
      
      // Store timestamp of when we tracked this view (only if tracking was successful)
      if (this.hasTracked) {
        localStorage.setItem(storageKey, Date.now().toString());
      }
    }
  }

  async trackView() {
    try {
      const response = await fetch('/api/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: this.slug })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        this.hasTracked = true;
        // Update the display immediately after tracking
        this.updateViewDisplay(data.totalViews, data.uniqueViews);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }

  async updateViewCount() {
    try {
      const response = await fetch(`/api/track-view?slug=${encodeURIComponent(this.slug)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.updateViewDisplay(data.totalViews, data.uniqueViews);
    } catch (error) {
      console.error('Error fetching view count:', error);
    }
  }

  updateViewDisplay(totalViews, uniqueViews) {
    // Find and update view count elements
    const viewElements = document.querySelectorAll('[data-view-count]');
    const uniqueViewElements = document.querySelectorAll('[data-unique-view-count]');

    viewElements.forEach(element => {
      if (element.hasAttribute('data-show-unique')) {
        element.textContent = uniqueViews || 0;
      } else {
        element.textContent = totalViews || 0;
      }
    });

    uniqueViewElements.forEach(element => {
      element.textContent = uniqueViews || 0;
    });

    // Also update elements with specific IDs for the current post
    const totalViewsElement = document.getElementById('total-views');
    const uniqueViewsElement = document.getElementById('unique-views');

    if (totalViewsElement) {
      totalViewsElement.textContent = totalViews || 0;
    }

    if (uniqueViewsElement) {
      uniqueViewsElement.textContent = uniqueViews || 0;
    }
  }
}

// Initialize view tracking when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the current post slug from the URL or a data attribute
  const path = window.location.pathname;
  const slugMatch = path.match(/\/post\/([^\/]+)/);
  
  if (slugMatch) {
    const slug = slugMatch[1];
    new ViewTracker(slug);
  }
});

// Export for manual initialization if needed
window.ViewTracker = ViewTracker;
