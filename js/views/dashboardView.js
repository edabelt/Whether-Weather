// js/views/dashboardView.js

import { mapWMOtoOWM, formatTemp } from "../refactorisation.js";

export function renderCityCard(box, daily) {
  const rawMin  = daily.temperature_2m_min[0];
  const rawMax  = daily.temperature_2m_max[0];
  const codes   = daily.weathercode || daily.weather_code;
  const rawCode = Array.isArray(codes) ? codes[0] : codes;
  const icon    = mapWMOtoOWM(rawCode);

  const imgEl = box.querySelector(".weather-icon");
  imgEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  imgEl.alt = `${box.querySelector(".heading").textContent} weather`;

  box.querySelector(".min-temp").textContent = formatTemp(rawMin);
  box.querySelector(".max-temp").textContent = formatTemp(rawMax);
}

export function applyHighlights() {
  const home = localStorage.getItem("homeCity");
  const favs = JSON.parse(localStorage.getItem("favCities") || "[]");

  document.querySelectorAll(".city-box").forEach(el => {
    const key = el.dataset.city;
    el.classList.toggle("home",     key === home);
    el.classList.toggle("favorite", favs.includes(key));
  });
}
