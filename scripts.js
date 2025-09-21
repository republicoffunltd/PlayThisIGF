document.addEventListener("DOMContentLoaded", () => {
  console.log("Play This IGF website loaded.");

  const burger = document.querySelector(".hamburger");
  const nav = document.getElementById("primary-nav");

  if (!burger || !nav) {
    console.error("Hamburger or primary nav not found");
    return;
  }

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a link (mobile)
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // Optional: close when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        burger.classList.remove("is-active");
        burger.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Optional: close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      nav.classList.remove("open");
      burger.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
    }
  });
});
