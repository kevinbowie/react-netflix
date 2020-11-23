import React, {useState, useEffect} from 'react';
import axios from './axios';
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
import './Row.css';

const BASE_URL = "https://image.tmdb.org/t/p/original";

const ytOpts = {
    height: "390",
    width: "100%",
    playerVars: {
        autoplay: 1
    }
};

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(fetchUrl);
            setMovies(response.data.results);
        }
        fetchData();
    }, [fetchUrl]);
    
    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.title || "")
                .then(url => {
                    // https://www.youtube.com/watch?v=X54F6ZX8x4zcf5sdf
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                })
                .catch(error => console.log(error));
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {movies.map(movie => (
                    <img key={movie.id} className={`row_poster ${isLargeRow && "row_poster-large"}`} src={`${BASE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name}
                        onClick={() => handleClick(movie)}
                    />
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={ytOpts} />}
        </div>
    )
}

export default Row;