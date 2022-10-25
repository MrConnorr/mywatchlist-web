import React from 'react';
import MoviesSeries from "../utilities/MoviesSeries";

function Series(props)
{
    return <MoviesSeries mediaType="series" apiKey={props.apiKey} />;
}

export default Series;