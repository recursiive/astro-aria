// Add your javascript here

window.darkMode = true; // Always dark mode

const stickyClasses = ["fixed", "h-14"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = [
	"border-neutral-600/40",
	"bg-neutral-900/60",
	"backdrop-blur-2xl",
];
const unstickyClassesContainer = ["border-transparent"];
let headerElement = null;

document.addEventListener("DOMContentLoaded", () => {
	headerElement = document.getElementById("header");
	
	// Always show dark mode
	showNight();
	
	stickyHeaderFuncionality();
	applyMenuItemClasses();
	evaluateHeaderPosition();
	mobileMenuFunctionality();
});

window.stickyHeaderFuncionality = () => {
	window.addEventListener("scroll", () => {
		evaluateHeaderPosition();
	});
};

window.evaluateHeaderPosition = () => {
	if (window.scrollY > 16) {
		headerElement.firstElementChild.classList.add(...stickyClassesContainer);
		headerElement.firstElementChild.classList.remove(
			...unstickyClassesContainer,
		);
		headerElement.classList.add(...stickyClasses);
		headerElement.classList.remove(...unstickyClasses);
		document.getElementById("menu").classList.add("top-[56px]");
		document.getElementById("menu").classList.remove("top-[75px]");
	} else {
		headerElement.firstElementChild.classList.remove(...stickyClassesContainer);
		headerElement.firstElementChild.classList.add(...unstickyClassesContainer);
		headerElement.classList.add(...unstickyClasses);
		headerElement.classList.remove(...stickyClasses);
		document.getElementById("menu").classList.remove("top-[56px]");
		document.getElementById("menu").classList.add("top-[75px]");
	}
};

// Always stay in dark mode - no toggle functionality needed
function showDay(animate) {
	// Do nothing - always stay in dark mode
}

function showNight(animate) {
	document.documentElement.classList.add("dark");
}

window.applyMenuItemClasses = () => {
	const menuItems = document.querySelectorAll("#menu a");
	for (let i = 0; i < menuItems.length; i++) {
		if (menuItems[i].pathname === window.location.pathname) {
			menuItems[i].classList.add("text-white");
		}
	}
};

function mobileMenuFunctionality() {
	document.getElementById("openMenu").addEventListener("click", () => {
		openMobileMenu();
	});

	document.getElementById("closeMenu").addEventListener("click", () => {
		closeMobileMenu();
	});
}

window.openMobileMenu = () => {
	document.getElementById("openMenu").classList.add("hidden");
	document.getElementById("closeMenu").classList.remove("hidden");
	document.getElementById("menu").classList.remove("hidden");
	document.getElementById("mobileMenuBackground").classList.add("opacity-0");
	document.getElementById("mobileMenuBackground").classList.remove("hidden");

	setTimeout(() => {
		document
			.getElementById("mobileMenuBackground")
			.classList.remove("opacity-0");
	}, 1);
};

window.closeMobileMenu = () => {
	document.getElementById("closeMenu").classList.add("hidden");
	document.getElementById("openMenu").classList.remove("hidden");
	document.getElementById("menu").classList.add("hidden");
	document.getElementById("mobileMenuBackground").classList.add("hidden");
};

// Lightbox functionality
window.openLightbox = (imgSrc, imgAlt) => {
	const lightbox = document.getElementById("lightbox");
	const lightboxImg = document.getElementById("lightbox-img");
	
	lightboxImg.src = imgSrc;
	lightboxImg.alt = imgAlt;
	lightbox.classList.add("active");
	
	// Prevent body scroll
	document.body.style.overflow = "hidden";
};

window.closeLightbox = () => {
	const lightbox = document.getElementById("lightbox");
	lightbox.classList.remove("active");
	
	// Restore body scroll
	document.body.style.overflow = "auto";
};

// Initialize lightbox functionality
document.addEventListener("DOMContentLoaded", () => {
	// Add click handlers to all images in blog posts
	const images = document.querySelectorAll(".prose img");
	images.forEach(img => {
		img.addEventListener("click", () => {
			openLightbox(img.src, img.alt);
		});
	});
	
	// Close lightbox when clicking on background
	const lightbox = document.getElementById("lightbox");
	lightbox.addEventListener("click", (e) => {
		if (e.target === lightbox) {
			closeLightbox();
		}
	});
	
	// Close lightbox with Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeLightbox();
		}
	});
});
