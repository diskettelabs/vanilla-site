const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menu?.classList.toggle("is-open", !isOpen);
});

document.addEventListener("click", (event) => {
  if (!menu || !menuToggle || menu.contains(event.target) || menuToggle.contains(event.target)) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.focus();
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const swatches = document.querySelectorAll(".swatches button");

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatches.forEach((item) => item.setAttribute("aria-pressed", "false"));
    swatch.setAttribute("aria-pressed", "true");
    document.documentElement.style.setProperty("--preview-accent", swatch.style.getPropertyValue("--swatch"));
  });
});

document.querySelectorAll("[data-waitlist]").forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.querySelector("span");
    if (!label) return;
    const original = label.textContent;
    label.textContent = "coming soon";
    window.setTimeout(() => {
      label.textContent = original;
    }, 1600);
  });
});
