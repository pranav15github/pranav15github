document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    const showSlide = (index) => {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });

        // Show the active slide
        slides[index].classList.add('active');
        // Need a tiny delay for transition or just set it
        setTimeout(() => {
            slides[index].style.opacity = '1';
        }, 10);

        // Update button states
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    };

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initialize
    showSlide(currentSlide);
});
