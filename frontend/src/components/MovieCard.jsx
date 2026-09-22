{/* Returns a Movie Card */}
import noMoviePoster from '../assets/no-movie-poster.png'
import { updateSearchCount } from '../appwrite'

// React passes all props into the component as ONE object, composed of:
// 1. 'movie' -> an object containing all the movie information from TMDB. 
// 2. 'isSelected' -> stores the ID of the currently selected movie. 
// 3. 'setIsSelected' -> React state setter used to change the selected movie. 
// The 'movie' object is also destructed to directly access its properties 
// instead of having to write movie.id, movie.title, movie.poster_path, etc.
const MovieCard = ({ movie: { id, title, vote_average, poster_path, release_date, original_language}, isSelected, setIsSelected}) => {
    
  return (
    // If the card is already selected, "isSelected" is set back to null to deselect it. 
    // Otherwise, store this movie's ID as the selected movie card.
    // Click anywhere on the card to toggle this.
    <div className="m-4" onClick={ async () => {
                            isSelected === id ? setIsSelected(null) : setIsSelected(id);
                            await updateSearchCount(query, movie);
                            updateSearchCount(searchTerm, movie);
                        }}
    >
        <div className="hover-3d">
            <figure className="max-w-40 bg-[#050217] rounded-2xl">

                {/* Movie Poster Image */}
                {/* Use the movie poster if available, otherwise use the noMoviePoster image */}
                {/* Only add the 'aura aura-dual' classes when a movie card is currently selected */}
                <img className={`rounded-2xl ${isSelected === id ? "aura aura-dual" : ""}`} src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : noMoviePoster} alt={title}/> 
                
                {/* Movie Title */}
                <h3 className="text-white font-bold m-2">{title}</h3>

                {/* Movie Details */}
                {/* Rating: Rounds the rating to one decimal point with .toFixed */}
                {/* Language: Converted to all uppercase */}
                {/* Year: only grabs the year from the date (first item in the split array) */}
                <p className="uppercase m-2">
                    ⭐ <b className="text-white">{vote_average ? vote_average.toFixed(1) : 'N/A'}</b> • {original_language} • {release_date ? release_date.split('-')[0] : 'N/A'}
                </p>
            
            </figure>
            {/* 8 empty divs needed for the Hover 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
        </div>
  )
}

export default MovieCard