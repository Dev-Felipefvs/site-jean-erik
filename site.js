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
