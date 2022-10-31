import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import styles from './css/WatchObjsSmCarousel.module.css';
import Button from "./Button";

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper'
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import "swiper/modules/effect-fade/effect-fade.min.css";
import "swiper/modules/free-mode/free-mode.min.css";
import {Icons} from "./Icons";

function WatchObjsSmCarousel(props)
{
    const url = props.mediaType === "movie" ? `https://api.themoviedb.org/3/movie/top_rated?api_key=${props.apiKey}&language=en-US&page=1` : `https://api.themoviedb.org/3/tv/top_rated?api_key=${props.apiKey}&language=en-US&page=1`;
    const [watchObjects, setWatchObjects] = useState([]);
    const navigate = useNavigate();
    const [hoveredObjId, setHoveredObjId] = useState(null);
    const [hoveredObjMediaType, setHoveredObjMediaType] = useState(null);
    const [isToucheEnded, setIsToucheEnded] = useState(true);

    const [swiper, setSwiper] = useState(null);

    useEffect(() =>
    {
        if(swiper !== null) swiper.setProgress(0, 0);

        setWatchObjects(props.data);

    }, [props.data]);

    useEffect(() =>
    {
        if(props.data === undefined)
        {
            fetch(url)
                .then(response => response.json())
                .then(data =>
                {
                    setWatchObjects(data.results);
                });
        }
    }, []);

    const handleClick = (watchObj) =>
    {
        if(isToucheEnded)
        {
            return `/${props.mediaType ? props.mediaType  === "tv" ? "series" : props.mediaType : hoveredObjMediaType === "tv" ? "series" : hoveredObjMediaType }/${watchObj.id}`;
        }
    }

    return (
        <Swiper
            slidesPerView={"auto"}
            spaceBetween={10}
            freeMode={true}
            watchSlidesProgress={true}
            pagination={{clickable: true,}}
            modules={[FreeMode]}
            style={{boxShadow: "0 0 30px black", borderRadius: "10px"}}
            onTouchEnd={() => setIsToucheEnded(true)}
            onSliderMove={() => setIsToucheEnded(false)}
            onSwiper={setSwiper}>

            {watchObjects !== null && watchObjects !== undefined ?
                <>
                    {watchObjects.map(watchObj =>
                        <SwiperSlide onMouseOver={() =>
                        {
                            setHoveredObjId(watchObj.id);
                            setHoveredObjMediaType(watchObj.media_type);
                        }} onMouseLeave={() => {
                            setHoveredObjId(null);
                            setHoveredObjMediaType(null);
                        }} key={watchObj.id} className={styles[props.type === "person" ? "list_element_person" : "list_element_other"]}>
                            <a style={{all: "unset", display: "flex", position: "absolute", width: "100%", height: "100%"}} href={handleClick(watchObj)}>
                                {watchObj.backdrop_path || watchObj.poster_path ?
                                    <img loading="lazy" src={`https://image.tmdb.org/t/p/original${watchObj.backdrop_path ? watchObj.backdrop_path : watchObj.poster_path}`} alt={watchObj.title ? watchObj.title + " backdrop" : watchObj.name + " backdrop"} />
                                : null}

                                {!watchObj.backdrop_path && !watchObj.poster_path &&
                                    <div className={styles.poster_placeholder}>
                                        {Icons.movieClapper}
                                    </div>
                                }

                                {hoveredObjId === watchObj.id &&
                                    <div className={styles.watchObj_content}>
                                        <h4>{watchObj.title ? watchObj.title.length > 33 ? watchObj.title.slice(0, 33) + "..." : watchObj.title : watchObj.name.length > 33 ? watchObj.name.slice(0, 33) + "..." : watchObj.name}</h4>
                                        <p>{watchObj.overview.length > 100 ? watchObj.overview.slice(0, 100) + "..." : watchObj.overview}</p>
                                        <Button href={handleClick(watchObj)}>Learn more</Button>
                                    </div>
                                }
                            </a>
                        </SwiperSlide>
                    )}
                </>
            : null}
        </Swiper>
    );
}

export default WatchObjsSmCarousel;