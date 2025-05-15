// dashboard.js refactorised
import {
  mapWMOtoOWM,
  formatTemp
} from "./refactorisation.js";

// Highlighting home & favourites cities on dashboard 
// retrieves user prefs from localStorage and toggles classes
function applyHighlights() {
  const home = localStorage.getItem("homeCity");
  const favs = JSON.parse(localStorage.getItem("favCities") || "[]");

  document.querySelectorAll(".city-box").forEach(el => {
    const key = el.dataset.city;
    // mark home city
    el.classList.toggle("home", key === home);
    // mark favourite cities
    el.classList.toggle("favorite", favs.includes(key));
  });
}

// Populating each city card with today’s data 
// fetches daily JSON and fills in icon & temps for each city-box
async function populateDashboard() {
  const boxes = document.querySelectorAll(".city-box");
  for (const el of boxes) {
    const key = el.dataset.city;
    try {
      const resp = await fetch(`/data/${key}_daily.json`);
      if (!resp.ok) throw new Error(resp.statusText);
      const { daily } = await resp.json();

      // raw values for today
      const rawMin = daily.temperature_2m_min[0];
      const rawMax = daily.temperature_2m_max[0];
      const codes  = daily.weathercode || daily.weather_code;
      const rawCode = Array.isArray(codes) ? codes[0] : codes;

      // choose icon and set attributes
      const iconCode = mapWMOtoOWM(rawCode);
      const imgEl = el.querySelector(".weather-icon");
      imgEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      imgEl.alt = `${el.querySelector(".heading").textContent} weather`;

      // format and show min/max temps
      el.querySelector(".min-temp").textContent = formatTemp(rawMin);
      el.querySelector(".max-temp").textContent = formatTemp(rawMax);
    } catch (e) {
      console.error(`Error loading data for ${key}:`, e);
    }
  }
}

// Initialisation of dashboard once DOM is loaded 
// runs populate, after that applies highlights and listeners for prefered changes
document.addEventListener("DOMContentLoaded", () => {
  populateDashboard().then(() => {
    applyHighlights(); // initial mark

    // update highlights in cases the user changes prefs in another tab
    window.addEventListener("storage", e => {
      if (e.key === "favCities" || e.key === "homeCity") {
        applyHighlights(); // re-apply after eevery change
      }
    });

    // also re-apply when tab gets focus (back from other page)
    window.addEventListener("focus", applyHighlights);
  });
});
