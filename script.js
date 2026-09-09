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
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion.matches) {
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

const heroStates = [
  ["private-chat.svg", "chat privately with local and cloud models"],
  ["file-upload.svg", "upload images, PDFs, or code files"],
  ["models.svg", "use local models or access OpenAI, Claude, and Gemini"],
  ["voice.svg", "speak instead of type with offline voice recognition"],
  ["on-device.svg", "conversations are safely stored on-device"],
  ["theming.svg", "customizable theming and personalization"],
  ["streaming.svg", "stream responses in real-time"],
  ["search.svg", "search across all your conversations"],
  ["desktop-web.svg", "available as a lightweight desktop and web app"],
  ["open-source.svg", "completely open source & MIT-licensed"],
];

const heroFeature = document.querySelector("[data-hero-feature]");
const heroIcon = document.querySelector("[data-hero-icon]");
const heroText = document.querySelector("[data-hero-text]");
const heroProgress = document.querySelector("[data-hero-progress]");
let heroIndex = 0;
let heroTimer;
let transitionTimer;

if (heroProgress) {
  heroStates.forEach((_, index) => {
    const marker = document.createElement("span");
    marker.classList.toggle("is-active", index === 0);
    heroProgress.append(marker);
  });
}

function renderHeroState(index, animate = true) {
  if (!heroFeature || !heroIcon || !heroText) return;
  heroIndex = (index + heroStates.length) % heroStates.length;

  const update = () => {
    const [icon, copy] = heroStates[heroIndex];
    heroIcon.src = `assets/framer/hero/${icon}`;
    heroText.textContent = copy;
    heroProgress?.querySelectorAll("span").forEach((marker, markerIndex) => {
      marker.classList.toggle("is-active", markerIndex === heroIndex);
    });
    heroFeature.classList.remove("is-changing");
  };

  window.clearTimeout(transitionTimer);
  if (!animate || reduceMotion.matches) {
    update();
    return;
  }

  heroFeature.classList.add("is-changing");
  transitionTimer = window.setTimeout(update, 240);
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
        website: formData.get("website"),
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
