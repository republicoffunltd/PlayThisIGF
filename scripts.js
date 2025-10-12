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

document.addEventListener('DOMContentLoaded', () => {
  // --- EXISTENTE: seu código de menu hamburger etc ---

  // === Tickets Modal + Eventbrite inline ===
  const openBtn = document.getElementById('open-tickets');
  const modal = document.getElementById('tickets-modal');
  const containerId = 'eventbrite-widget-container-1810172728359';

  let ebCreated = false; // cria o widget só uma vez

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-lock');

    if (!ebCreated && window.EBWidgets) {
      try {
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: '1810172728359',
          iframeContainerId: containerId,
          iframeContainerHeight: 720, // deve bater com o CSS
          onOrderComplete: function () { console.log('Order complete!'); }
        });
        ebCreated = true;

        // remove fallback se existir
        const fb = document.querySelector('#' + containerId + ' .eb-fallback');
        if (fb) fb.remove();
      } catch (err) {
        console.error('Erro ao montar Eventbrite:', err);
      }
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    document.body.classList.remove('body-lock');
    // Opcional: desmontar conteúdo do container para “resetar” completamente
    // document.getElementById(containerId).innerHTML = '';
    // ebCreated = false;
  }

  // Abrir pelo botão da hero
  openBtn?.addEventListener('click', openModal);

  // Fechar por X e overlay
  modal?.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches('[data-close-modal]')) {
      e.preventDefault();
      closeModal();
    }
  });

  // Fechar por ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
});

