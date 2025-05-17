// /js/dataStore.js
import { DEFAULT_CITY, getUnits, setUnits, getTheme, setTheme } from "./refactorisation.js";

// ─── Weather JSON fetching ────────────────────────────────────────
export async function getDaily(cityKey) {
  const res  = await fetch(`/data/${cityKey}_daily.json`);
  const json = await res.json();
  return json.daily;
}
export async function getHourly(cityKey) {
  const res  = await fetch(`/data/${cityKey}_hourly.json`);
  const json = await res.json();
  return json.hourly;
}

// ─── Hourly index helper ─────────────────────────────────────────
export function findHourlyIndex(hourly, dateStr, hour) {
  const HH     = String(hour).padStart(2, '0');
  const prefix = `${dateStr}T${HH}:`;
  let idx = hourly.time.findIndex(ts => ts.startsWith(prefix));
  if (idx < 0) {
    const dayPrefix = `${dateStr}T`;
    idx = hourly.time.findIndex(ts => ts.startsWith(dayPrefix)) || 0;
  }
  return idx;
}

// ─── User‐prefs (home & favourites, theme & units) ────────────────
// Home city (fallback to DEFAULT_CITY)
export function getHomeCity() {
  return localStorage.getItem("homeCity") || DEFAULT_CITY;
}
export function setHomeCity(key) {
  localStorage.setItem("homeCity", key);
}
// Favourite cities (max 3)
export function getFavCities() {
  return JSON.parse(localStorage.getItem("favCities")||"[]");
}
export function setFavCities(arr) {
  localStorage.setItem("favCities", JSON.stringify(arr));
}

// Theme & Units just proxy through refactorisation.js
export { getTheme, setTheme, getUnits, setUnits };
