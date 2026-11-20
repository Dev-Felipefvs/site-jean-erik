const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.hidden = false;
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
});

navigation.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || menuButton.getAttribute('aria-expanded') !== 'true') return;

  closeMenu();
  const destination = document.querySelector(link.hash);
  destination.setAttribute('tabindex', '-1');
  destination.focus({ preventScroll: true });
});

header.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;

  closeMenu();
  menuButton.focus();
});

document.addEventListener('pointerdown', (event) => {
  if (!header.contains(event.target)) closeMenu();
});

matchMedia('(max-width: 760px)').addEventListener('change', closeMenu);

const hero = document.querySelector('.hero');
const gsap = window.gsap;

if (hero && gsap) {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({
      defaults: { duration: 0.64, ease: 'power3.out', clearProps: 'transform,opacity' }
    })
      .addLabel('entrada', 0)
      .from('.title-line > span', { yPercent: 66, opacity: 0.3, stagger: 0.075 }, 'entrada')
      .from('.hero-portrait', { y: 26, rotation: 4, scale: 0.97, opacity: 0.4, duration: 0.82 }, 'entrada+=0.04')
      .from('.portrait-decoration', { xPercent: 0, yPercent: 5, rotation: 0, duration: 0.72 }, 'entrada+=0.1')
      .from('.hero-description', { y: 10, opacity: 0.65, duration: 0.48 }, 'entrada+=0.14')
      .from('.hero-services', { y: 13, opacity: 0.65, duration: 0.54 }, 'entrada+=0.18');
  }, hero);
}

const ScrollTrigger = window.ScrollTrigger;

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const sections = document.querySelectorAll(
      '.section-intro, .service-row, .about-name, .about-copy, .contact-details'
    );

    for (const section of sections) {
      gsap.from(section, {
        y: 22,
        opacity: 0.58,
        duration: 0.56,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: 'clamp(top 96%)',
          once: true
        }
      });
    }
  });
}
