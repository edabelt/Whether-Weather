document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".navbar-burger").forEach(burger => {
    const target = burger.dataset.target;
    const menu = document.getElementById(target);

    burger.addEventListener("click", () => {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });
  });
});
