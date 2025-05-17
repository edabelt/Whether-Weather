// /js/city-focus.js
import {
  mapWMOtoOWM,
  getUnits,
  formatTemp,
  formatWind
} from "./refactorisation.js";
import * as DataStore from "./dataStore.js";

// Bail out if this aint a city-focus page — only run on the city pages
function isCityFocusPage() {
  return Boolean(document.querySelector('.container[data-city]'));
}

// Helper: return label for day offset (Today or weekday name) so the card show the accurate day name
function getDayLabel(offset) {
  if (offset === 0) return 'Today';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, { weekday: 'long' });
}

// Main entry: fetch data and set up renderers
document.addEventListener("DOMContentLoaded", async () => {
  if (!isCityFocusPage()) return;
  const container = document.querySelector('.container[data-city]');
  const cityKey = container.dataset.city;
  getUnits(); // set units from user preference

  // Cache DOM refs for much faster access
  const dom = {
    subtitle:        document.querySelector('h2.subtitle'),
    nowLabel:        document.getElementById('now-label'),
    nowIcon:         document.getElementById('now-icon'),
    nowTemp:         document.getElementById('now-temp'),
    nowWind:         document.getElementById('now-wind'),
    feelsMax:        document.getElementById('feels-max'),
    feelsMin:        document.getElementById('feels-min'),
    bigIcon:         document.getElementById('big-icon'),
    maxTemp:         document.getElementById('max-temp'),
    maxWind:         document.getElementById('max-wind'),
    forecastCards:   Array.from(container.querySelectorAll('.forecast-card')),
    hourlyTrigger:   document.getElementById('hourly-trigger'),
    modal:           document.getElementById('hourlyModal'),
    modalBg:         container.querySelector('.modal-background'),
    modalClose:      document.getElementById('modal-close'),
    modalCloseFoot:  document.getElementById('modal-close-footer'),
    modalDayLabel:   document.getElementById('modal-day-label'),
    modalHourlyCont: document.getElementById('modal-hourly-content')
  };

  // Fetch daily & hourly json via DataStore
  const [daily, hourly] = await Promise.all([
    DataStore.getDaily(cityKey),
    DataStore.getHourly(cityKey)
  ]);

  let selectedDay = 0; // 0 = today index

  // Render "Now" card: current hour's weather
  function renderNow() {
    const now = new Date();
    const hh = now.getHours();
    const HH = String(hh).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');

    dom.nowLabel.innerHTML = `<span class=\"icon is-small\"><i class=\"fas fa-clock\"></i></span> ${HH}:${MM}`;
    const dateStr = daily.time[selectedDay];
    const idx = DataStore.findHourlyIndex(hourly, dateStr, hh);
    const codeArr = hourly.weather_code || hourly.weathercode;
    const code = Array.isArray(codeArr) ? codeArr[idx] : codeArr;

    dom.nowIcon.src        = `https://openweathermap.org/img/wn/${mapWMOtoOWM(code)}@2x.png`;
    dom.nowIcon.alt        = `Weather at ${HH}:00`;
    dom.nowTemp.textContent = formatTemp(hourly.temperature_2m[idx]);
    dom.nowWind.textContent = formatWind(hourly.wind_speed_10m[idx]);
  }

  // Render daily summary: big icon, max temp & wind, feels-like
  function renderDailySummary() {
    dom.subtitle.textContent = getDayLabel(selectedDay);
    const codeArr = daily.weather_code || daily.weathercode;
    const code    = Array.isArray(codeArr) ? codeArr[selectedDay] : codeArr;

    dom.bigIcon.src       = `https://openweathermap.org/img/wn/${mapWMOtoOWM(code)}@2x.png`;
    dom.maxTemp.textContent = formatTemp(daily.temperature_2m_max[selectedDay]);
    dom.maxWind.textContent = formatWind(daily.wind_speed_10m_max[selectedDay]);
    const hMax = daily.apparent_temperature_max?.[selectedDay];
    const hMin = daily.apparent_temperature_min?.[selectedDay];
    dom.feelsMax.textContent = hMax != null ? formatTemp(hMax) : 'N/A';
    dom.feelsMin.textContent = hMin != null ? formatTemp(hMin) : 'N/A';
  }

  // Render 7-day cards underneath
  function renderForecast() {
    const base = new Date();
    daily.time.forEach((_, i) => {
      const label = i === 0
        ? getDayLabel(0)
        : new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
            .toLocaleDateString(undefined, { weekday: 'short' });
      document.getElementById(`day-${i}`).textContent = label;
      const codeArr = daily.weather_code || daily.weathercode;
      const code    = Array.isArray(codeArr) ? codeArr[i] : codeArr;
      const iconEl  = document.getElementById(`icon-${i}`);

      iconEl.src = `https://openweathermap.org/img/wn/${mapWMOtoOWM(code)}@2x.png`;
      iconEl.alt = `Forecast: ${label}`;
      document.getElementById(`min-${i}`).textContent = formatTemp(daily.temperature_2m_min[i]);
      document.getElementById(`max-${i}`).textContent = formatTemp(daily.temperature_2m_max[i]);
    });
  }

  // Render hourly modal with 24 cards
  function renderHourlyModal() {
    dom.modalDayLabel.textContent = getDayLabel(selectedDay);
    const container = dom.modalHourlyCont;
    container.innerHTML = '';
    const dateStr = daily.time[selectedDay];

    for (let h = 0; h < 24; h++) {
      const col = document.createElement('div');
      col.className = 'column is-one-sixth';
      const box = document.createElement('div');
      box.className = 'box has-background-black has-text-white is-size-7 p-2';

      const lbl = document.createElement('p');
      lbl.className = 'has-text-warning has-text-weight-bold';
      lbl.textContent = `${String(h).padStart(2, '0')}:00`;
      box.appendChild(lbl);

      const idx = DataStore.findHourlyIndex(hourly, dateStr, h);
      const tempP = document.createElement('p');
      tempP.textContent = formatTemp(hourly.temperature_2m[idx]);
      box.appendChild(tempP);
      const windP = document.createElement('p');
      windP.textContent = formatWind(hourly.wind_speed_10m[idx]);
      box.appendChild(windP);

      col.appendChild(box);
      container.appendChild(col);
    }

    dom.modal.classList.add('is-active');
  }

  // Initial display
  renderNow();
  renderDailySummary();
  renderForecast();

  // Handlers: change day or open modal, then close
  dom.forecastCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      selectedDay = i;
      renderNow(); renderDailySummary(); renderForecast();
    });
  });
  dom.hourlyTrigger.addEventListener('click', renderHourlyModal);
  function closeModal() { dom.modal.classList.remove('is-active'); }
  dom.modalBg.addEventListener('click', closeModal);
  dom.modalClose.addEventListener('click', closeModal);
  dom.modalCloseFoot.addEventListener('click', closeModal);
});
