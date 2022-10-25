import React from 'react';
import WatchObjsCarousel from "./WatchObjsCarousel";
import WatchObjsSmCarousel from "../../utilities/WatchObjsSmCarousel";
import {Helmet} from "react-helmet-async";

function Main(props)
{
    return (
        <div style={{fontSize: "1.7vh"}}>
            <Helmet>
                <title>My Watch List</title>
            </Helmet>
            <WatchObjsCarousel apiKey={props.apiKey} />
            <h1 style={{color: "#deb992"}}>Top rated movies</h1>
            <WatchObjsSmCarousel apiKey={props.apiKey} mediaType="movie" />
            <h1 style={{color: "#deb992"}}>Top rated series</h1>
            <WatchObjsSmCarousel apiKey={props.apiKey} mediaType="tv" />
        </div>
    );
}

export default Main;