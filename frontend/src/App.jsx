import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'
import { MovieDetails } from './components/MovieDetails'

const API_BASE_URL = 'https://api.themoviedb.org/3' //version 3
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', 
    Authorization: `Bearer ${API_KEY}`
  }
}
//^as per the TMDB documentation

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]) //stores an array of objects FROM TMDB
  const [trendingMovies, setTrendingMovies] = useState([]) //stores an array of objects FROM APPWRITE
  const [isLoading, setIsLoading] = useState(true) //initially true as it has to initially load
  const [isSelected, setIsSelected] = useState(null) //stores the MOVIE that IS SELECTED
  const [index, setIndex] = useState(0); //index used to cycle through trending movies

//waits for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async(debouncedSearchTerm = '') => {
    setIsLoading(true) 
    setErrorMessage('')
    
    try {
      //if there is a search query, search and get a lsit of movies based on that
      //else just get the most popular movies at the moment
      //encodeURIComponent idk 
      const endpoint = debouncedSearchTerm ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(debouncedSearchTerm)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      
      
      const response = await fetch (endpoint, API_OPTIONS) //fetch is a built-in JS function
    
      if (!response.ok) { //If the response contains an issue, throw the error
        throw new Error(`Error Fetching Movies (HTTP Code: ${response.status})`)
      }

      const data = await response.json();
      
      setMovieList(data.results || [])

      //if a user is searching (query exists) and a movie was found based on their search
      if(debouncedSearchTerm && data.results.length > 0){
        await updateSearchCount(data.results[0])
      } 

    } catch (error) {
      setErrorMessage(error.message) //Needs to be a string so use .message 
      console.error(`Error fetching movies: ${error}`)
    
    }finally{
      setIsLoading(false)
    }

  }


  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
      
    } catch (error) {
      console.error(error)
      setErrorMessage("Error Fetching Trending Movies")
    }
  }

  useEffect(() => {
    loadTrendingMovies();

  }, []); ///empty deps array will only run the function once at start


  useEffect(() => {
    fetchMovies(debouncedSearchTerm);

  }, [debouncedSearchTerm]); 
//how everytime search term is updated, the function will be recalled






  useEffect(() => {

    //when a movie is selected, stop the interval 
    if (isSelected != null) {
      return;
    }
    
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % trendingMovies.length);
      
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isSelected, trendingMovies.length]); //updates after trendingMovies loads and when a movie is sleected





  return (
    <div className="min-h-screen md:h-screen overflow-hidden md:grid md:grid-cols-[400px_1fr] bg-linear-to-b from-[#040111] to-[#000077]">
        
      {/* === LEFT SIDE === */}
      <div className="flex flex-col gap-3 p-3 bg-transparent">
        
        <h1 className="text-4xl text-center font-bold">🍿 Trending <span className="text-gradient">Movies</span></h1>

        <div className="flex-1 bg-[#050217]/75 rounded-3xl">
          {/* Trending movies (add error messages?) */}
          
          {trendingMovies.length > 0 ?
            (isSelected != null ? 
              <MovieDetails movie={isSelected} index={-1} setIsSelected={setIsSelected}/>
              : <MovieDetails movie={trendingMovies[index]} index={index + 1}/>)
            : <Spinner />
          }
            
        </div>

      </div>

      {/* === RIGHT SIDE === */}
      <div className="flex flex-col gap-3 overflow-y-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between px-6 pt-6">
          <h2 className="text-2xl italic">All Movies</h2>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* ALL MOVIES */}
        <div className="flex-1 bg-[#050217]/80 px-4">
          
            {/* Loading Spinner */}
            {isLoading && <Spinner />}

            {/* Error Message */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        
            {/* MOVIE CARDS */}
            <ul className='flex flex-wrap'>
              {/* When mapping elements, each element needs its own unique key */}
              {movieList.map((movie) => (
                 <MovieCard key={movie.id} movie={movie} isSelected={isSelected} setIsSelected={setIsSelected} />
              ))}

            </ul>
        </div>
      </div>
    </div>
  )
}

export default App