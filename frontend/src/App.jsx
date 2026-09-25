import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateTrendingCount } from './appwrite'
import { MovieDetails } from './components/MovieDetails'

// TMDB API Configuration (as per their documentation)
// 3 = version 3 of the TMDB API
// Passed into fetch whenever a request is made
const API_BASE_URL = 'https://api.themoviedb.org/3' 
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', 
    Authorization: `Bearer ${API_KEY}`
  }
}

// Homepage //
const App = () => {
  const [searchTerm, setSearchTerm] = useState('') //Stores whatever the user is currently tying into the search bar (if anything)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('') //Stores the search term after the user has stopped typing for 500ms
  const [errorMessage, setErrorMessage] = useState('') //Stores an error message to be displayed if one is recieved 
  const [movieList, setMovieList] = useState([]) //Stores an array of movie objects FROM TMDB 
  const [trendingMovies, setTrendingMovies] = useState([]) //Stores an array of movie objects FROM APPWRITE
  const [isLoading, setIsLoading] = useState(true) //Tracks whether movies are currently being loaded
  const [isSelected, setIsSelected] = useState(null) //Stores the entire movie object that is currently selected. null means that no movie is selected.
  const [index, setIndex] = useState(0); //Tracks which trending movie is currently being displayed from the trendingMovies array. An index of -1 means that a selected movie is being displayed instead.

  // Wait 500ms after the user stops typing before updating
  // debouncedSearchTerm. This prevents unnecessary API requests
  // while the user is still typing their search.
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  // Fetch movies from TMDB to be displayed in the main section on the homepage.
  //
  // If a search term exists, we search TMDB for movies matching that term.
  // If there is no search term, we instead request movies sorted by popularity.
  const fetchMovies = async(debouncedSearchTerm = '') => {

    setIsLoading(true) // Show the loading spinner while the API request is running.
    setErrorMessage('') // Clear any previous error before starting a new request.
    
    try {

      // Choose which TMDB endpoint to use based on whether
      // the user has entered a search term.
      // encodeURIComponent() safely converts the user's search text
      // into a format that can be included in a URL.
      const endpoint = debouncedSearchTerm ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(debouncedSearchTerm)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      
      // fetch() is a built-in JavaScript function used to make
      // HTTP requests. We pass it the endpoint and our API options.
      const response = await fetch (endpoint, API_OPTIONS)
    
      // response.ok is false when the server returns an unsuccessful
      // HTTP status. In that case, manually throw an error so it can
      // be handled by the catch block below.
      if (!response.ok) { 
        throw new Error(`Error Fetching Movies (HTTP Code: ${response.status})`)
      }

      // Convert the API response from JSON into a JavaScript object.
      const data = await response.json();
      
      // TMDB stores the returned movies inside the "results" property.
      // Save those in movieList so they can be displayed as cards.
      // Or else set it as [] if no results were returned.
      setMovieList(data.results || [])

       // If the user searched for something and TMDB returned at least
       // one movie, send the first result to Appwrite to update its trending count.
      if(debouncedSearchTerm && data.results.length > 0){
        await updateTrendingCount(data.results[0])
      } 

      // If the user searched for something but TMDB returned no movies,
      // display a message instead of leaving the homepage area empty.
      if(debouncedSearchTerm && data.results.length == 0){
        setErrorMessage("No Results Found")
      } 

    } catch (error) {
      setErrorMessage(error.message) //Needs to be a string so use .message to get the text of the error
      console.error(`Error fetching movies: ${error}`)
    
    }finally{
      setIsLoading(false)
    }
  }

  // Run fetchMovies() whenever the debounced search term changes.
  //
  // Because we use the debounced value instead of searchTerm,
  // the API request only happens after the user has stopped typing for 500ms.
  useEffect(() => {fetchMovies(debouncedSearchTerm)}, [debouncedSearchTerm])


  // Gets the 5 most trending movies based on the data stored in Appwrite.
  // Stores the result in the trendingMovies array.
  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
 
    } catch (error) {
      console.error(error)
    }
  }

  // Run loadTrendingMovies() when the app first loads.
  //
  // The empty dependency array [] means this effect runs only once
  // after the component initially renders.
  useEffect(() => {loadTrendingMovies()}, [])



  // Automatically cycle through the trending movies.
  //
  // When a movie is selected, we stop the interval so the selected
  // movie remains on screen instead of continuing to change.
  useEffect(() => {

    // If the user has selected a movie, do nothing
    if (isSelected != null) {
      return;
    }
    
    // Change the trending movie being displayed every 10 seconds.
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 10000);

    //Necessary for setInterval to function properly
    return () => clearInterval(interval);

  }, [isSelected, trendingMovies.length]); 
  // ^This effect initially runs after the trendingMovies array populates (ie- the length of the array is changed) 
  // and when a movie card is selected or deselected 



  // Homepage UI //
  return (

    //Background Gradient 
    <div className="min-h-screen md:h-screen overflow-hidden md:grid md:grid-cols-[400px_1fr] bg-linear-to-b from-[#040111] to-[#000077]">
        
      {/* === LEFT SIDE === */}
      <div className="flex flex-col gap-3 p-3 bg-transparent">
        
        {/* Website Title */}
        <h1 className="text-4xl text-center font-bold">🍿 Trending <span className="text-gradient">Movies</span></h1>

        <div className="flex-1 bg-[#050217]/75 rounded-3xl">

          {/* Trending or Selected Movie
              - If a movie has been selected, show that selected movie.
              - Otherwise, if trending movies have been loaded,
              display the trending movie based on the current index value.
              - If the trending movies array hasn't been populated yet, show the spinner
              while the data is being loaded. */}

          {isSelected != null ?
              <MovieDetails movie={isSelected} index={-1} setIsSelected={setIsSelected}/>
              : trendingMovies.length > 0 ?
                (<MovieDetails movie={trendingMovies[index]} index={index + 1}/>) 
                : (<Spinner />)
          }
            
        </div>
      </div>

      {/* === RIGHT SIDE === */}
      <div className="flex flex-col gap-3 overflow-y-auto">

        {/* All Movies Search Section */}
        <header className="flex flex-col md:flex-row justify-between px-6 pt-6">
          
          <h2 className="text-2xl italic pb-4 md:pb-0">All Movies</h2>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        </header>

        {/* MOVIES CARDS */}
        <div className="flex-1 bg-[#050217]/80 px-4">
          
            {/* Loading Spinner - shown when loading the cards */}
            {isLoading && <Spinner />}

            {/* Error Message - shown if an error message is set */}
            {errorMessage && <p className="text-red-500 flex justify-center">{errorMessage}</p>}
        
            {/* MOVIE CARDS - displays once loading is finished */}
            {!isLoading && <ul className='flex flex-wrap'>

                {/* map() loops through movieList and creates
                    one MovieCard component for each movie.

                    The movie ID is used as the key because React
                    needs a unique key to keep track of each item
                    when rendering a list. */}
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} isSelected={isSelected} setIsSelected={setIsSelected} />
                ))}

            </ul>}

        </div>
      </div>
    </div>
  )
}

export default App