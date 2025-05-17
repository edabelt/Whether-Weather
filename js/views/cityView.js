// js/views/cityView.js
import { mapWMOtoOWM, formatTemp, formatWind } from "../refactorisation.js";

export function renderNow({ daily, hourly, findHourlyIndex }, selectedDay, dom) {
  const now = new Date();
  const hh = now.getHours();
  const HH = String(hh).padStart(2, "0");
  const MM = String(now.getMinutes()).padStart(2, "0");

  dom.nowLabel.innerHTML = `<span class="icon is-small"><i class="fas fa-clock"></i></span> ${HH}:${MM}`;

  const dateStr = daily.time[selectedDay];
  const idx     = findHourlyIndex(hourly, dateStr, hh);
  const codes   = hourly.weather_code || hourly.weathercode;
  const code    = Array.isArray(codes) ? codes[idx] : codes;

  dom.nowIcon.src  = `https://openweathermap.org/img/wn/${mapWMOtoOWM(code)}@2x.png`;
  dom.nowIcon.alt  = `Weather at ${HH}:00`;
  dom.nowTemp.textContent = formatTemp(hourly.temperature_2m[idx]);
  dom.nowWind.textContent = formatWind(hourly.wind_speed_10m[idx]);
}

export function renderDailySummary({ daily, hourly, findHourlyIndex }, selectedDay, dom) {
  const label = selectedDay === 0 ? "Today"
    : new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + selectedDay
      ).toLocaleDateString(undefined, { weekday: "long" });
  dom.subtitle.textContent = label;

  const codes = daily.weather_code || daily.weathercode;
  const code  = Array.isArray(codes) ? codes[selectedDay] : codes;

  dom.bigIcon.src  = `https://openweathermap.org/img/wn/${mapWMOtoOWM(code)}@2x.png`;
  dom.maxTemp.textContent = formatTemp(daily.temperature_2m_max[selectedDay]);
  dom.maxWind.textContent = formatWind(daily.wind_speed_10m_max[selectedDay]);

  const aMax = daily.apparent_temperature_max?.[selectedDay];
  const aMin = daily.apparent_temperature_min?.[selectedDay];
  dom.feelsMax.textContent = aMax != null ? formatTemp(aMax) : "N/A";
  dom.feelsMin.textContent = aMin != null ? formatTemp(aMin) : "N/A";
}

export function renderForecast({ daily, hourly, findHourlyIndex }, dom) {
  const base = new Date();
  daily.time.forEach((_, i) => {
    const label = i === 0
      ? "Today"
      : new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
          .toLocaleDateString(undefined, { weekday: "short" });

    document.getElementById(`day-${i}`).textContent = label;
    const codes = daily.weather_code || daily.weathercode;
    const code  = Array.isArray(codes) ? codes[i] : codes;
    const icon  = document.getElementById(`icon-${i}`);
    icon.src    = `https://openweathermap.org/img/wn/${mapWMOtoOWM(code)}@2x.png`;
    icon.alt    = `Forecast: ${label}`;

    document.getElementById(`min-${i}`).textContent = formatTemp(daily.temperature_2m_min[i]);
    document.getElementById(`max-${i}`).textContent = formatTemp(daily.temperature_2m_max[i]);
  });
}

export function renderHourlyModal({ daily, hourly, findHourlyIndex }, selectedDay, dom) {
  dom.modalDayLabel.textContent = dom.subtitle.textContent;

  const container = dom.modalHourlyCont;
  container.innerHTML = "";

  const dateStr = daily.time[selectedDay];
  for (let h = 0; h < 24; h++) {
    const idx = findHourlyIndex(hourly, dateStr, h);

    const col = document.createElement("div");
    col.className = "column is-one-sixth";

    const box = document.createElement("div");
    box.className = "box has-background-black has-text-white is-size-7 p-2";

    const lbl = document.createElement("p");
    lbl.className = "has-text-warning has-text-weight-bold";
    lbl.textContent = `${String(h).padStart(2, "0")}:00`;
    box.appendChild(lbl);

    const temp = document.createElement("p");
    temp.textContent = formatTemp(hourly.temperature_2m[idx]);
    box.appendChild(temp);

    const wind = document.createElement("p");
    wind.textContent = formatWind(hourly.wind_speed_10m[idx]);
    box.appendChild(wind);

    col.appendChild(box);
    container.appendChild(col);
  }

  dom.modal.classList.add("is-active");
}
