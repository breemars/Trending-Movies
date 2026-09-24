import noMoviePoster from '../assets/no-movie-poster.png'

export const MovieDetails = ({ movie: { id, title, vote_average, poster_path, release_date, original_language, overview}, index, setIsSelected}) => {
    
    return (
        <div className="relative bg-cover bg-center h-full rounded-3xl p-3" 
            style={{
            backgroundImage: `url(${poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : noMoviePoster})`,
            }}
        >

            {/* black overlay */}
            <div className="absolute inset-0 bg-[#050217]/80 rounded-3xl"></div>

            <div className="relative z-10 m-4">

                {/* is greater than 0, else show back button */}
                {index < 0 ? 
                    <button className="btn btn-soft btn-secondary float-right ml-2" onClick={() => setIsSelected(null)}>Back</button>
                    : <h1 className="text-[175px] font-bold text-gradient m-0">{index}</h1>
                }
                                
                {/* Movie Title */}
                <h3 className="text-white text-xl font-bold my-2">{title}</h3>

                {/* Movie Rating, Language, Release Date */}
                <p className="uppercase my-2 ">
                    ⭐ <b className="text-white">{vote_average ? vote_average.toFixed(1) : 'N/A'}</b> • {original_language} • {release_date ? release_date : 'N/A'}
                </p>

                {/* Movie Summary */}
                <p className="text-white">{overview}</p>

            </div>
        </div>
    )
}
