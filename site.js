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
  gsap.matchMedia().add({
    motion: '(prefers-reduced-motion: no-preference)',
    wide: '(min-width: 761px)'
  }, ({ conditions }) => {
    if (!conditions.motion) return;

    const fade = {
      y: 24, opacity: 0.64, duration: 0.58, ease: 'power3.out',
      immediateRender: false, clearProps: 'transform,opacity'
    };
    const elements = document.querySelectorAll('[data-reveal], [data-sequence], [data-parallax]');

    for (const element of elements) {
      const enter = { trigger: element, start: 'clamp(top 92%)', once: true };

      if (element.hasAttribute('data-parallax')) {
        gsap.fromTo(element.querySelector('img'), { yPercent: -5 }, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.45 }
        });
      } else if (element.hasAttribute('data-sequence')) {
        const cards = Array.from(element.children);
        const photoSequence = element.classList.contains('photo-cards');
        const entrance = { ...fade, y: photoSequence ? 40 : 26 };

        if (conditions.wide) {
          const timeline = gsap.timeline({ scrollTrigger: enter });
          cards.forEach((card, index) => {
            timeline.from(card, {
              ...entrance,
              rotation: photoSequence ? [-3.5, 3, -2][index] : 0
            }, [0, 0.135, 0.235][index]);
          });
        } else {
          cards.forEach((card, index) => {
            gsap.from(card, {
              ...entrance,
              y: photoSequence ? 32 : 22,
              rotation: photoSequence ? [-2, 2, -1][index] : 0,
              delay: index * 0.055,
              scrollTrigger: { ...enter, trigger: card, start: 'clamp(top 95%)' }
            });
          });
        }
      } else {
        gsap.from(element, { ...fade, scrollTrigger: enter });
      }
    }

    const faq = document.querySelector('.faq-list');
    const updatePositions = () => ScrollTrigger.refresh(true);
    faq.addEventListener('toggle', updatePositions, true);
    return () => faq.removeEventListener('toggle', updatePositions, true);
  });
}
