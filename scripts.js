document.addEventListener("DOMContentLoaded", () => {
  console.log("Play This IGF website loaded.");

  const burger = document.querySelector(".hamburger");
  const nav = document.getElementById("primary-nav");

  if (!burger || !nav) {
    console.error("Hamburger menu or nav not found");
    return;
  }

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
    burger.classList.toggle("is-active");

    const expanded = burger.classList.contains("is-active");
    burger.setAttribute("aria-expanded", expanded);
  });
});
