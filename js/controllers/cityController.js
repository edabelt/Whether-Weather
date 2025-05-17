// /js/cityController.js
import { getUnits } from "../refactorisation.js";
import * as DataStore from "../dataStore.js";
import * as CityView from "../views/cityView.js";

// Bail out if this aint a city-focus page — only run on the city pages
function isCityFocusPage() {
  return Boolean(document.querySelector('.container[data-city]'));
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!isCityFocusPage()) return;

  // apply user’s preferred units
  getUnits();

  const container  = document.querySelector('.container[data-city]');
  const cityKey    = container.dataset.city;

  // cache all the DOM refs
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

  // fetch both daily & hourly in parallel
  const [ daily, hourly ] = await Promise.all([
    DataStore.getDaily(cityKey),
    DataStore.getHourly(cityKey)
  ]);

  const data = { daily, hourly, findHourlyIndex: DataStore.findHourlyIndex };
  let selectedDay = 0; // 0 = today

  // initial render
  CityView.renderNow(data, selectedDay, dom);
  CityView.renderDailySummary(data, selectedDay, dom);
  CityView.renderForecast(data, dom);

  // when you click a forecast card, switch the day
  dom.forecastCards.forEach((card, i) => {
    card.addEventListener("click", () => {
      selectedDay = i;
      CityView.renderNow(data, selectedDay, dom);
      CityView.renderDailySummary(data, selectedDay, dom);
      CityView.renderForecast(data, dom);
    });
  });

  // open hourly panel
  dom.hourlyTrigger.addEventListener("click", () => {
    CityView.renderHourlyModal(data, selectedDay, dom);
  });

  // close modal handlers
  function close() { dom.modal.classList.remove("is-active"); }
  dom.modalBg.addEventListener("click", close);
  dom.modalClose.addEventListener("click", close);
  dom.modalCloseFoot.addEventListener("click", close);
});
