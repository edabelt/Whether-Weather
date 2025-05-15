// /js/my-city.js

// Only run on the My City page
function isMyCityPage() {
  return !!document.getElementById('my-city-container');
}

// Map Open-Meteo WMO weathercode → OpenWeatherMap icon code
function mapWMOtoOWM(code) {
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

document.addEventListener("DOMContentLoaded", async () => {
  if (!isMyCityPage()) return;
  const container = document.getElementById('my-city-container');
  const homeKey = localStorage.getItem('homeCity');

  if (!homeKey) {
    container.innerHTML = `
      <div class="notification is-warning">
        You haven't selected a Home City yet. Please <a href="/settings/">set one in Settings</a>.
      </div>`;
    return;
  }

  // Set city name heading
  const nameEl = document.getElementById('city-name');
  nameEl.textContent = cityLabelMap[homeKey] || homeKey;

  try {
    // Fetch both datasets
    const [dailyResp, hourlyResp] = await Promise.all([
      fetch(`/data/${homeKey}_daily.json`),
      fetch(`/data/${homeKey}_hourly.json`)
    ]);
    if (!dailyResp.ok || !hourlyResp.ok) throw new Error('Fetch failed');
    const daily  = (await dailyResp.json()).daily;
    const hourly = (await hourlyResp.json()).hourly;

    // --- Right Now: hourly data ---
    const hCodes = hourly.weather_code || hourly.weathercode;
    const rawNow = Array.isArray(hCodes) ? hCodes[0] : hCodes;
    const nowIcon = mapWMOtoOWM(rawNow);
    document.getElementById('now-icon').src = `https://openweathermap.org/img/wn/${nowIcon}@2x.png`;
    document.getElementById('now-temp').textContent = `${hourly.temperature_2m[0]} °C`;
    document.getElementById('now-wind').textContent = `${hourly.wind_speed_10m[0]} km/h`;

    // --- Big icon & max: daily data ---
    const dCodes = daily.weather_code || daily.weathercode;
    const rawDay = Array.isArray(dCodes) ? dCodes[0] : dCodes;
    const bigIcon = mapWMOtoOWM(rawDay);
    document.getElementById('big-icon').src = `https://openweathermap.org/img/wn/${bigIcon}@2x.png`;
    document.getElementById('max-temp').textContent = `${daily.temperature_2m_max[0]} °C`;
    document.getElementById('max-wind').textContent = `${daily.wind_speed_10m_max[0]} km/h`;

    // --- 7-day forecast: daily data ---
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const label = i === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' });
      document.getElementById(`day-${i}`).textContent = label;

      const rawFc = Array.isArray(dCodes) ? dCodes[i] : dCodes;
      const iconFc = mapWMOtoOWM(rawFc);
      document.getElementById(`icon-${i}`).src = `https://openweathermap.org/img/wn/${iconFc}@2x.png`;
      document.getElementById(`min-${i}`).textContent = `${daily.temperature_2m_min[i]} °C`;
      document.getElementById(`max-${i}`).textContent = `${daily.temperature_2m_max[i]} °C`;
    }

  } catch (error) {
    console.error('My City load failed for', homeKey, error);
    container.innerHTML = `
      <div class="notification is-danger">
        Sorry, we couldn’t load data for “${cityLabelMap[homeKey] || homeKey}”.
      </div>`;
  }
});

// City label map
const cityLabelMap = {
  berlin: 'Berlin', london: 'London', paris: 'Paris', tromso: 'Tromsø',
  vilnius: 'Vilnius', zagreb: 'Zagreb', amsterdam: 'Amsterdam',
  waterford: 'Waterford', copenhagen: 'Copenhagen', cork: 'Cork'
};
