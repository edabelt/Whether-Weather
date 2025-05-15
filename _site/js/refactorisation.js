// utility functions for weather app implemented to apply a lecture concept: Refactor

// Default home city if none selected by the user
export const DEFAULT_CITY = "waterford";

// Theme preference (light or dark)
export function getTheme() {
  return localStorage.getItem("theme") || "light";
}
export function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

// Temperature units (metric or imperial)
export function getUnits() {
  return localStorage.getItem("units") || "metric";
}
export function setUnits(units) {
  localStorage.setItem("units", units);
}

// Unit conversions
export function cToF(c) {
  return Math.round((c * 9/5) + 32);
}
export function kmhToMph(kmh) {
  return Math.round(kmh * 0.621371);
}

// Format temperature according to user units
export function formatTemp(val) {
  return getUnits() === "imperial"
    ? `${cToF(val)}°F`
    : `${val}°C`;
}

// Format wind speed according to user units
export function formatWind(val) {
  return getUnits() === "imperial"
    ? `${kmhToMph(val)} mph`
    : `${val} km/h`;
}

// Map WMO weather code to OpenWeather icon code
export function mapWMOtoOWM(code) {
  if (code === 0) return "01d";
  if ([1,2,3].includes(code)) return "02d";
  if ([45,48].includes(code)) return "50d";
  if ([51,53,55,56,57].includes(code)) return "09d";
  if ([61,63,65,66,67].includes(code)) return "10d";
  if ([80,81,82].includes(code)) return "09d";
  if ([71,73,75,77,85,86].includes(code)) return "13d";
  if ([95,96,99].includes(code)) return "11d";
  return "01d";
}
