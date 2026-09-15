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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const waitlistTarget = document.querySelector("#waitlist");
const waitlistEmail = document.querySelector("#waitlist-email");

document.querySelectorAll("[data-waitlist-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    menu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");

    waitlistTarget?.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });

    if (window.location.hash !== "#waitlist") {
      window.history.pushState(null, "", "#waitlist");
    }

    waitlistEmail?.focus({ preventScroll: true });
  });
});

const heroStates = [
  ["assets/framer/hero-chat.svg", "chat privately with local and cloud models"],
  ["assets/framer/hero-files.svg", "upload images, PDFs, or code files"],
  ["assets/framer/hero-chip.svg", "use local models or access OpenAI, Claude, and Gemini"],
  ["assets/framer/hero-mic.svg", "speak instead of type with offline voice recognition"],
  ["assets/framer/hero-lock.svg", "conversations are safely stored on-device"],
  ["assets/framer/hero-sliders.svg", "customizable theming and personalization"],
  ["assets/framer/hero-stream.svg", "stream responses in real-time"],
  ["assets/framer/hero-search.svg", "search across all your conversations"],
  ["assets/framer/hero-grid.svg", "available as a lightweight desktop and web app"],
  ["assets/framer/hero-code.svg", "completely open source & MIT-licensed"],
];

const heroFeature = document.querySelector("[data-hero-feature]");
const heroIcon = document.querySelector("[data-hero-icon]");
const heroText = document.querySelector("[data-hero-text]");
let heroIndex = 0;
let heroTimer;

function renderHeroState(index, animate = true) {
  if (!heroFeature || !heroIcon || !heroText) return;
  heroIndex = (index + heroStates.length) % heroStates.length;
  const [icon, copy] = heroStates[heroIndex];
    heroIcon.src = icon;
  heroText.textContent = copy;

  if (animate && !reduceMotion.matches) {
    heroFeature.animate([{ opacity: 0.35 }, { opacity: 1 }], {
      duration: 240,
      easing: "ease-out",
    });
  }
}

function startHeroTimer() {
  window.clearInterval(heroTimer);
  if (reduceMotion.matches) return;
  heroTimer = window.setInterval(() => renderHeroState(heroIndex + 1), 3000);
}

function chooseHeroState(index) {
  renderHeroState(index);
  startHeroTimer();
}

heroFeature?.addEventListener("click", () => chooseHeroState(heroIndex + 1));
document.querySelector(".send-button")?.addEventListener("click", () => chooseHeroState(heroIndex + 1));
document.querySelectorAll("[data-hero-jump]").forEach((control) => {
  control.addEventListener("click", () => chooseHeroState(Number(control.dataset.heroJump)));
});
reduceMotion.addEventListener?.("change", startHeroTimer);
startHeroTimer();

const swatches = document.querySelectorAll(".swatches button");

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatches.forEach((item) => item.setAttribute("aria-pressed", "false"));
    swatch.setAttribute("aria-pressed", "true");
    document.documentElement.style.setProperty("--preview-accent", swatch.style.getPropertyValue("--swatch"));
  });
});

const waitlistEndpoint = "https://vanilla-waitlist-675c18d120c6.herokuapp.com/api/waitlist";
const waitlistForm = document.querySelector("[data-waitlist-form]");
const waitlistStatus = document.querySelector("[data-waitlist-status]");

waitlistForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = waitlistForm.querySelector('button[type="submit"]');
  const formData = new FormData(waitlistForm);

  submitButton.disabled = true;
  waitlistStatus.className = "waitlist-status";
  waitlistStatus.textContent = "Joining…";

  try {
    const response = await fetch(waitlistEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Unable to join right now.");

    waitlistForm.reset();
    waitlistStatus.className = "waitlist-status is-success";
    waitlistStatus.textContent = result.alreadyExists
      ? "You’re already on the list. We’ll be in touch."
      : "You’re on the list. We’ll be in touch.";
  } catch (error) {
    waitlistStatus.className = "waitlist-status is-error";
    waitlistStatus.textContent = error instanceof Error ? error.message : "Unable to join right now.";
  } finally {
    submitButton.disabled = false;
  }
});
