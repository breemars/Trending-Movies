# Trending Movies

A React application that allows users to search for movies, view detailed movie information, and discover which movies are currently trending based on user interactions on the site.

Trending Movies uses the **[TMDB API](https://www.themoviedb.org/?language=en-US)** for up-to-date movie information and **Appwrite** to store and track trending movie data.

![Trending Movies](./screenshots/________.png)

### 🚀 Live Demo

You can view the project here:

**[View Trending Movies](____________________________)**

## ✨ Features

* Search for movies
* View popular movies when no search is entered
* View detailed information about a selected movie
* View movie ratings, release dates, languages, and descriptions
* Track trending movies based on user interactions
* Automatically cycle through trending movies
* Click on a movie to update its trending count
* Loading states
* Error handling
* Responsive UI
* Custom movie cards and styling
* Debounced movie searching to reduce unnecessary API requests

## ⭐ Features I Added Independently

Although I followed a [tutorial](https://www.youtube.com/watch?v=8vIDZO_w7lY) as a starting point for this project, I took the project in my own direction and implemented many features and design choices independently.

### UI & Styling

* Used **DaisyUI** to style and create my own UI/UX design instead of copying the tutorial's UI code
* Used **Lucide React** for icons instead of downloading or copying icon assets
* Added DaisyUI 3D card styling, aura effect (when a movie card is selected), and loading spinner

### Movie Selection & Details

* Created `isSelected` state to keep track of which movie is currently selected
* Added a dedicated movie details view
* Added movie descriptions to the details section
* Added a **Back** button for returning from the selected movie view
* Added additional movie information to Appwrite so it could be displayed later

### Trending Movies

* Created my own trending movies UI that only displays one movie at a time and automatically cycles through the top 5 movies every 10 seconds
* Added an `index` state to keep track of the currently displayed trending movie
* Updated a movie's trending count when a user clicks on a movie card
* Unlike the tutorial, trending counts are updated both when a user searches for a movie and when a user clicks on a movie card

### Backend / Appwrite

* Used the movie ID instead of the search input to look up movies in the database, allowing them to be tracked consistently
* Updated the Appwrite implementation to use the newer Appwrite syntax
* Expanded the information stored in the Appwrite database

## 🛠️ Technologies & Tools

### Frontend

* **React** — Frontend UI and application rendering
* **Vite** — Frontend development and build tooling
* **Tailwind CSS** — Styling
* **DaisyUI** — UI components and additional styling
* **Lucide React** — Icons
* **React Use** — Provides the `useDebounce` hook for delayed searching

### Backend & APIs

* **Appwrite** — Backend database for storing and tracking trending movie data
* **TMDB API** — Movie information: titles, ratings, posters, descriptions, and more

### Other

* **DM Sans** — Google Font used throughout the application

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project with:

```env
VITE_TMDB_API_KEY=<your_tmdb_api_key>

VITE_APPWRITE_DATABASE_ID=<your_appwrite_database_id>
VITE_APPWRITE_PROJECT_ID=<your_appwrite_project_id>
VITE_APPWRITE_TABLE_ID=<your_appwrite_table_id>
VITE_APPWRITE_ENDPOINT=<your_appwrite_endpoint>
```

### 4. Start the development server

```bash
cd frontend
npm run dev
```

The application will then be available at the local URL provided by Vite.

## 📚 Project Background

I built this project to continue improving my React skills and to work with concepts that I had not used as much in my previous project, such as debouncing and third-party API integration.

This project gave me more experience connecting a React frontend to external APIs, working with databases, managing application state, handling asynchronous operations, and implementing UI/UX features.

## 📸 Screenshots

### Movie Search

![Movie Search](./screenshots/________________.png)

### Movie Details

![Movie Details](./screenshots/________________.png)

### Trending Movies

![Trending Movies](./screenshots/________________.png)

### Mobile Design

![Mobile Design](./screenshots/________________.png)
