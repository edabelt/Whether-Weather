//basic nav behaviours
import { DEFAULT_CITY } from "./refactorisation.js";

document.addEventListener("DOMContentLoaded", () => {
  // Mobile burger toggle for collapse navigation
  const burger = document.querySelector(".navbar-burger");
  if (burger) {
    const menu = document.getElementById(burger.dataset.target);
    burger.addEventListener("click", () => {
      // toggle active state to show/hide menu
      burger.classList.toggle("is-active");
      if (menu) menu.classList.toggle("is-active");
    });
  }

  // "My City" link redirects to stored home or default
  const myCityLink = document.querySelector('.navbar-item[href="/my-city/"]');
  if (myCityLink) {
    myCityLink.addEventListener("click", (e) => {
      e.preventDefault();

      // get user’s home preference
      let homeKey = localStorage.getItem("homeCity");

      // if none set, fallback to DEFAULT_CITY
      if (!homeKey) {
        homeKey = DEFAULT_CITY;
        localStorage.setItem("homeCity", homeKey);
      }

      // go to that city’s focus page
      window.location.href = `/city/${homeKey}/`;
    });
  }
});
