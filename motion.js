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

const progress = document.querySelector(".reading-progress");
const navigation = [...document.querySelectorAll("nav a[href^='#']")].map(link => ({
  link,
  section: document.querySelector(link.hash)
}));
let scrollUpdatePending = false;

function updateScrollState() {
  scrollUpdatePending = false;
  const page = document.documentElement;
  const range = page.scrollHeight - page.clientHeight;
  const position = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
  progress.style.setProperty("--progress", position);

  const active = position >= 0.995 ? navigation.at(-1) :
    navigation.findLast(({ section }) => section.getBoundingClientRect().top <= innerHeight * 0.32);
  for (const item of navigation) {
    if (item === active) item.link.setAttribute("aria-current", "location");
    else item.link.removeAttribute("aria-current");
  }
}

function scheduleScrollUpdate() {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
window.addEventListener("resize", scheduleScrollUpdate);
window.addEventListener("load", scheduleScrollUpdate);
updateScrollState();

const preview = document.querySelector(".project-preview");
const previewTitle = document.querySelector("#preview-title");
const previewImage = preview.querySelector(".preview-image");

for (const link of document.querySelectorAll(".preview-link")) {
  link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        typeof preview.showModal !== "function") return;
    event.preventDefault();
    previewTitle.textContent = link.closest(".project-card").querySelector("h3").textContent;
    previewImage.alt = link.querySelector("img").alt;
    previewImage.src = link.href;
    preview.showModal();
  });
}
