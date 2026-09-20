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
  ["assets/framer/hero-code.svg", "source code available for research & educational putposes"],
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

const appThemeNames = [
  "aurora", "blue-moon", "chocolate", "dragonfruit", "dreamsicle", "lavender", "lemon", "lime",
  "mint", "monochrome", "peach", "plum", "raspberry", "strawberry", "vanilla",
];
const themeSwatches = document.querySelector("[data-theme-swatches]");
const selectedThemeLabel = document.querySelector("[data-selected-theme]");

function applySiteTheme(theme) {
  const colors = theme?.colors;
  if (!colors) return;
  const root = document.documentElement;
  const background = String(colors.background || "").replace("#", "");
  const channels = background.length === 6
    ? [0, 2, 4].map((index) => parseInt(background.slice(index, index + 2), 16))
    : [255, 255, 255];
  const luminance = (channels[0] * 299 + channels[1] * 587 + channels[2] * 114) / 1000;
  root.dataset.appTheme = theme.name;
  root.style.setProperty("--paper", colors.background);
  root.style.setProperty("--site-surface", colors.surface || colors.assistantMessage);
  root.style.setProperty("--ink", colors.text);
  root.style.setProperty("--soft-ink", `color-mix(in srgb, ${colors.text} 58%, transparent)`);
  root.style.setProperty("--hairline", colors.border);
  root.style.setProperty("--preview-accent", colors.primary || theme.accent || colors.userMessage);
  root.style.setProperty("--theme-accent", theme.accent || colors.primary || colors.text);
  root.style.setProperty("--app-icon-filter", luminance < 150 ? "invert(1)" : "none");
  if (selectedThemeLabel) selectedThemeLabel.textContent = theme.displayName || theme.name;
  localStorage.setItem("vanilla-site-theme", theme.name);
}

async function loadSiteThemes() {
  if (!themeSwatches) return;
  const themes = await Promise.all(appThemeNames.map(async (name) => {
    try {
      const response = await fetch(`themes/${name}.json`);
      if (!response.ok) throw new Error("Theme unavailable");
      return response.json();
    } catch {
      return null;
    }
  }));
  const availableThemes = themes.filter(Boolean);
  const activeName = localStorage.getItem("vanilla-site-theme") || "strawberry";
  themeSwatches.replaceChildren(...availableThemes.map((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.style.setProperty("--swatch", theme.accent || theme.colors.primary);
    button.title = theme.displayName || theme.name;
    button.setAttribute("aria-label", theme.displayName || theme.name);
    button.setAttribute("aria-pressed", String(theme.name === activeName));
    button.addEventListener("click", () => {
      themeSwatches.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      applySiteTheme(theme);
    });
    return button;
  }));
  applySiteTheme(availableThemes.find((theme) => theme.name === activeName) || availableThemes[0]);
}

loadSiteThemes();

const toolsButton = document.querySelector('[data-omnibar-tool="extensions"]');
const toolsMenu = document.querySelector("#site-tools-menu");
const promptCard = document.querySelector(".prompt-card");

function closeToolsMenu() {
  if (!toolsMenu || !toolsButton) return;
  toolsMenu.hidden = true;
  toolsMenu.setAttribute("aria-hidden", "true");
  toolsButton.setAttribute("aria-expanded", "false");
}

toolsButton?.addEventListener("click", () => {
  const expanded = toolsButton.getAttribute("aria-expanded") === "true";
  toolsMenu.hidden = expanded;
  toolsMenu.setAttribute("aria-hidden", String(expanded));
  toolsButton.setAttribute("aria-expanded", String(!expanded));
});

document.addEventListener("click", (event) => {
  if (toolsMenu && toolsButton && !toolsMenu.contains(event.target) && !toolsButton.contains(event.target)) closeToolsMenu();
});

document.querySelectorAll("[data-omnibar-tool]").forEach((control) => {
  const tool = control.dataset.omnibarTool;
  if (tool === "extensions" || tool === "submit") return;
  control.addEventListener("click", () => {
    if (tool === "attach") {
      control.dataset.active = "true";
      control.querySelector("span").textContent = "file attached";
      window.setTimeout(() => {
        control.dataset.active = "false";
        control.querySelector("span").textContent = "attach files";
      }, 1200);
      return;
    }
    control.dataset.active = String(control.dataset.active !== "true");
    control.setAttribute("aria-pressed", control.dataset.active);
    if (tool === "dictation") promptCard?.classList.toggle("is-dictating", control.dataset.active === "true");
  });
});

const siteSubmitButton = document.querySelector('[data-omnibar-tool="submit"]');
siteSubmitButton?.addEventListener("click", () => {
  if (siteSubmitButton.dataset.mode === "stop") {
    siteSubmitButton.dataset.mode = "submit";
    siteSubmitButton.title = "Submit";
    siteSubmitButton.setAttribute("aria-label", "Submit message");
    siteSubmitButton.querySelector("img").src = "assets/app/arrow-up.svg";
    return;
  }
  siteSubmitButton.dataset.mode = "stop";
  siteSubmitButton.title = "Stop";
  siteSubmitButton.setAttribute("aria-label", "Stop response");
  siteSubmitButton.querySelector("img").src = "assets/app/stop.svg";
  chooseHeroState(heroIndex + 1);
  window.setTimeout(() => siteSubmitButton.click(), 900);
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
