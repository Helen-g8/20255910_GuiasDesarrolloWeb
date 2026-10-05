// Menú móvil
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));

// Carrusel del hero
const slides = document.querySelectorAll(".hero-slide");
const controlsContainer = document.getElementById("sliderControls");
let currentSlide = 0;
let slideInterval;

slides.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (idx === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Ir a diapositiva " + (idx + 1));
    dot.addEventListener("click", () => { goToSlide(idx); resetInterval(); });
    controlsContainer.appendChild(dot);
});
const dots = document.querySelectorAll(".slider-dot");

function goToSlide(n) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}
function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5500);
}
slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5500);

// Animación fade-up al hacer scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
}, { threshold: 0.12 });
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));