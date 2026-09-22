import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

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
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]) //stores an array of objects FROM TMDB
  const [trendingMovies, setTrendingMovies] = useState([]) //stores an array of objects FROM APPWRITE ...THEY USE DIFFERENT IDENTIFIERS 
  const [isLoading, setIsLoading] = useState(true) //initially true as it has to initially load
  const [isSelected, setIsSelected] = useState(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

//waits for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async(query = '') => {
    setIsLoading(true) 
    setErrorMessage('')
    
    try {
      //if there is a search query, search and get a lsit of movies based on that
      //else just get the most popular movies at the moment
      //encodeURIComponent idk 
      const endpoint = query ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      
      
      const response = await fetch (endpoint, API_OPTIONS) //fetch is a built-in JS function
    
      if (!response.ok) { //If the response contains an issue, throw the error
        throw new Error(`Error Fetching Movies (HTTP Code: ${response.status})`)
      }

      const data = await response.json();
      
      setMovieList(data.results || [])
      console.log(data.results)

      //if a user is searching (query exists) and a movie was found based on their search
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
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
      console.log(movies)
      
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

  return (
    <div className="h-screen overflow-hidden md:grid md:grid-cols-[400px_1fr] bg-linear-to-b from-[#040111] to-[#000077]">
        {/* ^ or min-h-screen? */}

      {/* === LEFT SIDE === */}
      <div className="flex flex-col gap-3 p-5 bg-transparent">
        
        <h1 className="text-4xl text-center font-bold">🍿 Trending <span className="text-gradient">Movies</span></h1>

        <div className="flex-1 bg-[#050217]/75 rounded-4xl">
          {/* Trending movies (add loading and error messages?) */}

          {trendingMovies.length > 0 && (
            <section>
              

              
              <ul className='flex flex-wrap'>
                {trendingMovies.map((movie, index) => (
                    <li key = {movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.posterURL} className='max-h-50' />
                    </li>
                ))}


              </ul>
            </section>
          )}

        </div>

      </div>

      {/* === RIGHT SIDE === */}
      <div className="flex flex-col gap-3 px-5 overflow-y-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between p-6">
          <h2 className="text-2xl italic">All Movies</h2>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* ALL MOVIES */}
        <div className="flex-1 bg-[#050217]/80">
          
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