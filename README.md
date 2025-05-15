#Whethe- Weather

Whether-Weather is a static site that displays weather information for various cities and detailed hourly forecasts. It uses Eleventy for build, Bulma CSS for styling, and client-side JavaScript to fetch and render weather data.

## Project Description

This project aims to provide users with:

* A **Dashboard** showing current and daily weather for multiple cities.
* A **City Focus** page with detailed 7‑day and 24‑hour forecasts as well as the current wheather.
* **Settings**: it allows user to choose home city, favourite cities, units (metric/imperial), and theme (light/dark).
* **News** section with climate-related articles: browse an index of teaser cards (image, summary, ‘Read More’) and view full articles on individual pages.

## Installation Instructions

If you haven’t yet created a GitHub repo, first make one on GitHub (e.g., `weather-dashboard`). Then clone or initialize locally:

**Option A: Clone existing repo**

```bash
git clone https://github.com/yourusername/Whether-Weather.git
cd Whether-Weather
```

**Option B: Initialize a new repo and push**

```bash
mkdir Whether-Weather && cd Whether-Weather
# copy or create your project files here
git init
git add .
git commit -m "Initial commit"
git branch -M main
# set your remote URL (replace with your repo)
git remote add origin https://github.com/edabelt/Whether-Weather.git
git push -u origin main
```

2. **Install dependencies**:

   ```bash
   npm install
   ```
3. **Build and serve locally**:

   ```bash
   npm run build
   npm run serve
   ```

   Site will be at `http://localhost:8080`

## Usage

* **Dashboard** (`/`): shows city cards with icon, min/max temps.
* **City Focus** (`/city/{cityKey}/`): click a city to see daily summary and click “Hourly Forecast” to open modal with 24‑hour details.
* **Settings** (`/settings/`): choose theme, units, home and favourites.
* **News** (`/news/`): browse climate news teasers with images & summaries, click ‘Read More’ to view full articles.

### Example

```
earth ↦ Dashboard loads 6 city cards
→ Click Waterford ↦ City focus shows daily and hourly details
→ Settings ↦ change to imperial units ↦ temperatures now in °F
```

## Screenshots

**Dashboard**

![Dashboard showing city cards](/images/screenshots/dashboard.png)

**City Focus**

![City Focus page](/images/screenshots/city-focus.png)

**City Focus**

![City Focus page with hourly modal open](/images/screenshots/hourly-modal.png)


**Settings**

![Settings page with theme and units toggles](/images/screenshots/settings.png)

**Dark Mode**

![Dashboard in dark mode theme](/images/screenshots/dark-mode.png)

**Favourite Cities**

![Favourite cities highlighted on dashboard](/images/screenshots/favourite-cities.png)

![Dashboard in dark mode theme](/images/screenshots/dark-mode.png)

## Configuration

* Data files live in `./data/{cityKey}_daily.json` and `{cityKey}_hourly.json`.
* CSS in `./css/` (Bulma plus custom).
* JS in `./js/` (split into `refactorisation.js`, `dashboard.js`, `city-focus.js`, `settings.js`, `header.js`).

## Contributing Guidelines

1. Fork the repo
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow code style and include comments consistent with existing files.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Contact Information

Maintainer: Ever David Beltrán Pinto — edbeltranpi.chs.gmail.com

## Acknowledgements

* Eleventy for static site generator
* Bulma for CSS framework
* Open‑Meteo for weather data API
* SETU Waterford
>>>>>>> 8bef467 (Initial commit)
