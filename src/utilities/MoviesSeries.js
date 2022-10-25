import React, {useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import WatchObjsListControls from "./WatchObjsListControls";
import WatchObjList from "./WatchObjList";

function MoviesSeries(props)
{
    const {apiKey, mediaType} = props;
    const [watchObjects, setWatchObjects] = useState([]);
    const {type} = useParams();
    const navigate = useNavigate();

    const moviesBtn = ["Now playing", "Upcoming", "Popular"];
    const seriesBtn = ["Airing today", "On the air", "Popular"];

    const [searchParams] = useSearchParams();

    useEffect(() =>
    {
        if (!type)
        {
            mediaType === "movies" ? navigate('/movies/now_playing', {replace: true}) : navigate('/tvSeries/airing_today', {replace: true});
        }
    }, []);


    const getWatchObjectsByType = () =>
    {
        fetch(`https://api.themoviedb.org/3/${mediaType === "series" ? "tv" : "movie"}/${type ? type : mediaType === "movies" ? "now_playing" : "airing_today"}?api_key=${apiKey}&language=en-US&page=${searchParams.get("page") ? searchParams.get("page") : 1}`)
            .then(response => response.json())
            .then(data =>
            {
                setWatchObjects(data);
            })
            .catch(err =>
            {
                console.log(err);
            })
    }

    useEffect(() =>
    {
        getWatchObjectsByType();
    }, [type, searchParams.get("page")]);


    const switchWatchObjects = (clickedBtn) =>
    {
        switch(clickedBtn)
        {
            case "Now playing":
                navigate(`/movies/now_playing`);
                break;
            case "Upcoming":
                navigate(`/movies/upcoming`);
                break;
            case "Popular":
                navigate(`/${mediaType === "movies" ? "movies" : "tvSeries"}/popular`);
                break;
            case "Airing today":
                navigate(`/tvSeries/airing_today`);
                break;
            case "On the air":
                navigate(`/tvSeries/on_the_air`);
                break;
        }
    }

    return(
        <>
            <WatchObjsListControls controls={mediaType === "movies" ? moviesBtn : seriesBtn} switchWatchObjects={switchWatchObjects} />
            <WatchObjList mediaType={mediaType} data={watchObjects} />
        </>
    )
}

export default MoviesSeries;