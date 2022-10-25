import React from 'react';
import MoviesSeries from "../utilities/MoviesSeries";

function Movies(props)
{
    return <MoviesSeries mediaType="movies" apiKey={props.apiKey} />;
}

export default Movies;