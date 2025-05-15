# Whether-Weather

Whether-Weather is a static site that displays weather information for various cities and detailed hourly forecasts. It uses Eleventy for build, Bulma CSS for styling, and client-side JavaScript to fetch and render weather data.

## Project Description

This project aims to provide users with:

* A **Dashboard** showing current and daily weather for multiple cities.
* A **City Focus** page with detailed 7‑day and 24‑hour forecasts as well as the current wheather.
* **Settings**: it allows user to choose home city, favourite cities, units (metric/imperial), and theme (light/dark).
* **News** section with climate-related articles: browse an index of teaser cards (image, summary, ‘Read More’) and view full articles on individual pages.

## Installation Instructions

1. **Create a GitHub repository** named `Whether-Weather` (using your account):

   * Go to [GitHub](https://github.com) → **New** → **Repository**.
   * Name it exactly `Whether-Weather`, add a README if you like, then click **Create repository**.

2. **Clone your repo locally**:

   ```bash
   # Clone into your current directory
   git clone git@github.com:edabelt/Whether-Weather.git
   # Change into the project folder (replace path if you cloned elsewhere)
   cd Whether-Weather
   ```

3. **If you’re starting fresh (no remote yet)**:

   ```bash
   mkdir Whether-Weather && cd Whether-Weather
   # copy or create your project files into this folder
   git init
   git add .
   git commit -m "Initial project files"
   git branch -M main
   git remote add origin git@github.com:edabelt/Whether-Weather.git
   git push --set-upstream origin main
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Build and serve locally**:

   ```bash
   npm run build
   npm run serve
   ```

Site will be available at `http://localhost:8080`

## Usage

* **Dashboard** (`/`): shows city cards with icon, min/max temps.
* **City Focus** (`/city/{cityKey}/`): click a city to see daily summary and click “Hourly Forecast” to open modal with 24‑hour details.

  * To preview a specific city locally, open in your browser:
    `http://localhost:8080/city/waterford/` (replace `waterford` with any city key).
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

![Dashboard showing city cards](/images/dashboard.png)

**City Focus**

![City Focus page with hourly modal open](/images/city-focus.png)

**Settings**

![Settings page with theme and units toggles](/images/settings.png)

**Dark Mode**

![Dashboard in dark mode theme](/images/dark-mode.png)

**Favourite Cities**

![Favourite cities highlighted on dashboard](/images/favourite-cities.png)

**Hourly Panel**

![Hourly forecast panel modal](/images/hourly-panel.png)

## Configuration

* Data files live in `./data/{cityKey}_daily.json` and `{cityKey}_hourly.json`.
* CSS in `./css/` (Bulma plus custom).
* JS in `./js/` (split into `refactorisation.js`, `dashboard.js`, `city-focus.js`, `settings.js`, `header.js`).
