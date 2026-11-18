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

const hoverPointer = matchMedia("(hover: hover) and (pointer: fine)");

for (const surface of document.querySelectorAll(".terminal, .project-card")) {
  surface.addEventListener("pointermove", event => {
    if (!motionPreference.matches || !hoverPointer.matches || event.pointerType !== "mouse") return;
    const bounds = surface.getBoundingClientRect();
    surface.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    surface.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    surface.classList.add("pointer-lit");
  }, { passive: true });

  surface.addEventListener("pointerleave", () => surface.classList.remove("pointer-lit"));
}
