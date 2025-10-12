document.addEventListener("DOMContentLoaded", () => {
  console.log("Play This IGF website loaded.");

  /* =========================
     HAMBURGER / MOBILE NAV
     ========================= */
  const burger = document.querySelector(".hamburger");
  const nav = document.getElementById("primary-nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.classList.toggle("is-active", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.classList.remove("is-active");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          burger.classList.remove("is-active");
          burger.setAttribute("aria-expanded", "false");
        }
      }
    });

    // Fecha no ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        nav.classList.remove("open");
        burger.classList.remove("is-active");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =========================
     EVENTBRITE CHECKOUT (INLINE NO MODAL)
     - usa qualquer elemento com [data-open-tickets] como gatilho
     - widget criado uma única vez
     ========================= */
  const ticketTriggers = document.querySelectorAll("[data-open-tickets]");
  const modal = document.getElementById("tickets-modal");
  const iframeContainerId = "eventbrite-widget-container-1810172728359";

  let ebCreated = false;

  function openTicketsModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("body-lock");

    // cria o widget apenas na primeira abertura
    if (!ebCreated && window.EBWidgets) {
      try {
        window.EBWidgets.createWidget({
          widgetType: "checkout",
          eventId: "1810172728359",
          iframeContainerId: iframeContainerId,
          iframeContainerHeight: 720, // mantenha em sincronia com o CSS
          onOrderComplete: function () {
            console.log("Order complete!");
          },
        });
        ebCreated = true;

        // remove fallback, se existir
        const fb = document.querySelector(
          "#" + iframeContainerId + " .eb-fallback"
        );
        if (fb) fb.remove();
      } catch (err) {
        console.error("Erro ao montar Eventbrite inline:", err);
      }
    }

    // se o menu mobile estiver aberto, fecha ao abrir o modal
    if (nav?.classList.contains("open")) {
      nav.classList.remove("open");
      burger?.classList.remove("is-active");
      burger?.setAttribute("aria-expanded", "false");
    }
  }

  function closeTicketsModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
    document.body.classList.remove("body-lock");
    // Se quiser resetar completamente a cada abertura:
    // document.getElementById(iframeContainerId).innerHTML = '';
    // ebCreated = false;
  }

  // Gatilhos (hero, navbar, faixa mobile etc.)
  ticketTriggers.forEach((el) => el.addEventListener("click", openTicketsModal));

  // Fechar por X e por overlay (ambos têm data-close-modal)
  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches("[data-close-modal]")) {
      e.preventDefault();
      closeTicketsModal();
    }
  });

  // Fechar no ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") {
      closeTicketsModal();
    }
  });

  /* =========================
   MOBILE CTA BAR (slides in/out somente pelo HERO)
   ========================= */
  const hero = document.querySelector(".hero");
  const mobileCta = document.getElementById("mobile-cta");
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  if (hero && mobileCta) {
    // mesma altura do CSS (fallback 90)
    const NAV_HEIGHT =
      parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--nav-height")) || 90;

    let heroVisible = true;

    const showBar = () => {
      if (!isMobile()) return;
      if (!mobileCta.classList.contains("is-visible")) {
        mobileCta.classList.remove("is-hiding");
        mobileCta.classList.add("is-visible");
      }
    };

    const hideBar = () => {
      if (mobileCta.classList.contains("is-visible")) {
        mobileCta.classList.remove("is-visible");
        mobileCta.classList.add("is-hiding");
        mobileCta.addEventListener("animationend", () => {
          mobileCta.classList.remove("is-hiding");
        }, { once: true });
      }
    };

    const updateBar = () => {
      if (!isMobile()) { hideBar(); return; }
      if (!heroVisible) { showBar(); } else { hideBar(); }
    };

    // Observa o HERO: considera "fora de vista" assim que passar do navbar
    if ("IntersectionObserver" in window) {
      const heroIO = new IntersectionObserver(
        ([entry]) => {
          heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.01;
          updateBar();
        },
        {
          threshold: [0, 0.01, 0.1, 0.9, 1],
          rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`
        }
      );
      heroIO.observe(hero);
    } else {
      // Fallback simples
      const fallback = () => {
        const heroRect = hero.getBoundingClientRect();
        heroVisible = heroRect.bottom > NAV_HEIGHT;
        updateBar();
      };
      document.addEventListener("scroll", fallback, { passive: true });
      window.addEventListener("resize", fallback);
      fallback();
    }

    // Reavalia em resize/rotação e inicializa estado
    window.addEventListener("resize", updateBar);
    requestAnimationFrame(updateBar);
  }

    /* =========================
     BACK TO TOP BUTTON
     ========================= */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    // Mostrar quando rolar além de 500px
    const toggleBackToTop = () => {
      if (window.scrollY > 500) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    };

    // Scroll suave para o topo
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

});
