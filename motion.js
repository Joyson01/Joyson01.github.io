const motionPreference = matchMedia("(prefers-reduced-motion: no-preference)");

if (motionPreference.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (motionPreference.matches && !entry.target.contains(document.activeElement)) {
        entry.target.animate(
          [{ opacity: 0.45, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
          { duration: 520, easing: "cubic-bezier(.2,.75,.25,1)" }
        );
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll(".project-card, .about-copy, .skills, .experience-grid, .contact-inner")
    .forEach(element => observer.observe(element));

  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) return;
    observer.disconnect();
    document.getAnimations().forEach(animation => animation.cancel());
  });
}
