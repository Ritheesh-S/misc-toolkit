const dropdown = document.querySelector('.dropdown');
const toggle = document.querySelector('.dropdown-toggle');

if (dropdown && toggle) {
  toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
    }
  });
}
