import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'


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
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(true) //initially true as it has to initially load
  const [isSelected, setIsSelected] = useState(null)

  const fetchMovies = async() => {
    //setIsLoading(true) //prob not needed??????????
    //setMovieList([]) ????????????????????????????????????????????
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch (endpoint, API_OPTIONS) //fetch is a built-in JS function
    
      if (!response.ok) { //If the response contains an issue, throw the error
        throw new Error(`Error Fetching Movies (HTTP Code: ${response.status})`)
      }

      const data = await response.json();
      
      setMovieList(data.results || [])
      console.log(data.results)

    } catch (error) {
      setErrorMessage(error.message) //Needs to be a string so use .message 
      console.error(`Error fetching movies: ${error}`)
    
    }finally{
      setIsLoading(false)
    }

  }

  useEffect(() => {
    fetchMovies();

  }, []); //empty deps array will only run the function once at start

  return (
    <div className="h-screen overflow-hidden md:grid md:grid-cols-[400px_1fr] bg-linear-to-b from-[#040111] to-[#000077]">
        {/* ^ or min-h-screen? */}

      {/* === LEFT SIDE === */}
      <div className="flex flex-col gap-3 p-5 bg-transparent">
        
        <h1 className="text-4xl text-center font-bold">🍿 Trending <span className="text-gradient">Movies</span></h1>

        <div className="flex-1 bg-[#050217]/75 rounded-4xl">
          {/* Trending movies */}
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