// Countdown
const weddingDate = new Date("May 16, 2026").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
    const el = document.getElementById("countdown");
    if (el) {
        el.innerHTML = distance < 0 ? "<h3>The Celebration has Begun!</h3>" :
            `<div class="countdown-item"><span class="countdown-number">${days}</span><span class="countdown-label">Days to go</span></div>`;
    }
}
updateCountdown();

// Slideshow
let slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) { showSlides(slideIndex = n); }

function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active-dot");
    }
    
    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex - 1].classList.add("active-dot");
    }
}

// Auto-advance slideshow
setInterval(() => { 
    slideIndex++; 
    showSlides(slideIndex); 
}, 5000);

// Nav Sticky Effect
window.onscroll = () => {
    const nav = document.getElementById("navbar");
    if (nav) {
        window.pageYOffset > window.innerHeight * 0.7 ? nav.classList.add("sticky") : nav.classList.remove("sticky");
    }
};

// Accordion Logic
document.querySelectorAll(".qa-question").forEach(q => {
    q.addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content) {
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
        }
    });
});