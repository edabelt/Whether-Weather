// js/controllers/dashboardController.js

import * as DataStore      from "../dataStore.js";       // fetch & cache layer
import * as DashboardView  from "../views/dashboardView.js"; // dumb renderers & highlights

// Initialize and populate every city-box on the Dashboard
async function initDashboard() {
  const boxes = document.querySelectorAll(".city-box");
  for (const box of boxes) {
    const key = box.dataset.city;
    try {
      // get the “daily” object for this city
      const daily = await DataStore.getDaily(key);
      // hand it to the view to render icon + min/max
      DashboardView.renderCityCard(box, daily);
    } catch (err) {
      console.error(`Failed loading data for ${key}`, err);
    }
  }

  // once all cards are filled, apply home & favourite highlights
  DashboardView.applyHighlights();
}

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();

  // if user changes prefs in another tab → re-apply highlights
  window.addEventListener("storage", DashboardView.applyHighlights);
  // if user comes back to this tab → re-apply highlights
  window.addEventListener("focus",   DashboardView.applyHighlights);
});
