document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  // height of banner + navbar
  const header = document.querySelector('.slim-banner');
  const nav    = document.querySelector('.navbar');
  const offset = (header?.offsetHeight || 0) + (nav?.offsetHeight || 0);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > offset) {
      sidebar.classList.add('fixed');
    } else {
      sidebar.classList.remove('fixed');
    }
  });
});
