/* ============================================================
   BEN BOYER — GLOBAL ANIMATION ENGINE (SAFE VERSION)
   Fade-in, slide, scale animations with guaranteed visibility
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    // Select all animatable elements
    const animatedElements = document.querySelectorAll(
        ".fade-in, .slide-left, .slide-right, .scale-up"
    );

    // Intersection Observer for reveal-on-scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0.15,       // when 15% of element is visible
            rootMargin: "0px 0px -10% 0px",
        }
    );

    animatedElements.forEach((el) => {

        // Ensure nothing is *ever* stuck at opacity: 0
        // Force visibility for components that must always show
        if (
            el.classList.contains("resume-viewer") ||
            el.classList.contains("resume-iframe") ||
            el.tagName.toLowerCase() === "iframe" ||
            el.closest(".resume-viewer")
        ) {
            el.classList.add("visible");
            return;
        }

        // Observe for scroll-based reveal
        observer.observe(el);

        // Fallback — if JS loads late or observer fails,
        // automatically reveal after 500ms
        setTimeout(() => {
            el.classList.add("visible");
        }, 500);

    });

});
