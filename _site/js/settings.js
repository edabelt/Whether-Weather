// settings manage theme, units, and preferences of the app
import {
  DEFAULT_CITY,
  getTheme,
  setTheme,
  getUnits,
  setUnits
} from './refactorisation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Dark-mode: apply saved theme on page load
  const currentTheme = getTheme();
  document.body.classList.toggle('dark-mode', currentTheme === 'dark');

  // Theme toggle switch in the header or settings
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.checked = currentTheme === 'dark';
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      setTheme(newTheme);
      document.body.classList.toggle('dark-mode', newTheme === 'dark');
    });
  }

  // Units toggle radios (metric ⇄ imperial)
  // remember user choice for temperatures & wind on settings
  const currentUnits = getUnits();
  document.querySelectorAll('input[name="units"]').forEach(radio => {
    radio.checked = currentUnits === radio.value;
    radio.addEventListener('change', () => {
      setUnits(radio.value);
      // optional: refresh page to apply new units everywhere
    });
  });

  // Settings page: home city & favourite cities form (implementing lecture concepts: arrays)
  const favCheckboxes = Array.from(document.querySelectorAll('input[name="favCities"]'));
  const homeRadios = Array.from(document.querySelectorAll('input[name="homeCity"]'));
  const saveBtn = document.getElementById('savePrefs');
  const resetBtn = document.getElementById('resetPrefs');

  if (!saveBtn) return; // not on settings page, bail out

  // Load and set favourite checkboxes
  const storedFavs = JSON.parse(localStorage.getItem('favCities') || '[]');
  favCheckboxes.forEach(cb => {
    cb.checked = storedFavs.includes(cb.value);
  });

  // Load and set home radio (or default)
  const storedHome = localStorage.getItem('homeCity') || DEFAULT_CITY;
  homeRadios.forEach(rb => rb.checked = rb.value === storedHome);

  // Limit to max 3 favourites so the option makes sense
  function updateFavStates() {
    const count = favCheckboxes.filter(cb => cb.checked).length;
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
    localStorage.setItem('favCities', JSON.stringify(newFavs));

    const newHome = homeRadios.find(rb => rb.checked)?.value || DEFAULT_CITY;
    localStorage.setItem('homeCity', newHome);

    // Go back to dashboard after saving
    window.location.href = '/';
  });

  // Reset button: clear all saved prefs and reload defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('favCities');
      localStorage.removeItem('homeCity');
      setUnits('metric');
      localStorage.removeItem('units');
      setTheme('light');
      window.location.reload(); // reflect the defaults on form
    });
  }
});
