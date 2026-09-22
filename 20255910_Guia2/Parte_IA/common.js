/* Menú móvil */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn) {
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
}

/* Animación de aparición al hacer scroll (fade + desplazamiento) */
const revealEls = document.querySelectorAll(".fade-up");
if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add("in-view"));
}
