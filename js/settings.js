// settings manage theme, units, and preferences of the app
import * as DataStore from './dataStore.js';

document.addEventListener('DOMContentLoaded', () => {
  // Dark-mode: apply saved theme on page load
  const currentTheme = DataStore.getTheme();
  document.body.classList.toggle('dark-mode', currentTheme === 'dark');

  // Theme toggle switch in the header or settings
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.checked = currentTheme === 'dark';
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      DataStore.setTheme(newTheme);
      document.body.classList.toggle('dark-mode', newTheme === 'dark');
    });
  }

  // Units toggle radios (metric ⇄ imperial)
  const currentUnits = DataStore.getUnits();
  document.querySelectorAll('input[name="units"]').forEach(radio => {
    radio.checked = currentUnits === radio.value;
    radio.addEventListener('change', () => {
      DataStore.setUnits(radio.value);
      // optional: refresh page to apply new units everywhere
    });
  });

  // Settings page: home city & favourite cities form
  const favCheckboxes = Array.from(document.querySelectorAll('input[name="favCities"]'));
  const homeRadios    = Array.from(document.querySelectorAll('input[name="homeCity"]'));
  const saveBtn       = document.getElementById('savePrefs');
  const resetBtn      = document.getElementById('resetPrefs');

  if (!saveBtn) return;  // not on settings page, bail out

  // Load and set favourite checkboxes
  const storedFavs = DataStore.getFavCities();
  favCheckboxes.forEach(cb => {
    cb.checked = storedFavs.includes(cb.value);
  });

  // Load and set home radio (or default)
  const storedHome = DataStore.getHomeCity();
  homeRadios.forEach(rb => rb.checked = rb.value === storedHome);

  // Limit to max 3 favourites
  function updateFavStates() {
    const count   = favCheckboxes.filter(cb => cb.checked).length;
    const disable = count >= 3;
    favCheckboxes.forEach(cb => {
      cb.disabled = disable && !cb.checked;
    });
  }
  favCheckboxes.forEach(cb => cb.addEventListener('change', updateFavStates));
  updateFavStates();

  // Save preferences button
  saveBtn.addEventListener('click', () => {
    const newFavs = favCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
    DataStore.setFavCities(newFavs);

    const newHome = homeRadios.find(rb => rb.checked)?.value || DataStore.getHomeCity();
    DataStore.setHomeCity(newHome);

    // Go back to dashboard after saving
    window.location.href = '/';
  });

  // Reset button: clear all saved prefs and reload defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      DataStore.setFavCities([]);
      DataStore.setHomeCity(DataStore.getHomeCity()); // this will reset to DEFAULT_CITY
      DataStore.setUnits('metric');
      DataStore.setTheme('light');
      window.location.reload(); // reflect the defaults on form
    });
  }
});
