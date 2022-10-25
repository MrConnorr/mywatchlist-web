import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import styles from '../../css/Carousel.module.css';
import Button from "../../utilities/Button";
import Moment from "moment";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay, Navigation } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import "swiper/modules/effect-fade/effect-fade.min.css";
import Rating from "../watchObj/watchObjComp/Rating";

function WatchObjsCarousel(props)
{
    const trending = `https://api.themoviedb.org/3/trending/all/week?api_key=${props.apiKey}`;
    const [watchObjects, setWatchObjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() =>
    {
        fetch(trending)
            .then(response => response.json())
            .then(data => {
                setWatchObjects(data.results);
            });
    }, []);

    const handleClick = (watchObj) =>
    {
        navigate(`/${watchObj.media_type === "tv" ? "series" : watchObj.media_type }/${watchObj.id}`);
    }

    return (
        <Swiper
            modules={[Pagination, EffectFade, Autoplay, Navigation]}
            pagination={{clickable: true}}
            navigation={true}
            autoplay={{delay: 3500, disableOnInteraction: false}}
            initialSlide={1}
            loop={true}
            effect={"fade"}
            preloadImages={true}
            updateOnImagesReady={true}
            className={styles.carousel_container}>

            {watchObjects.map(watchObj =>
            <SwiperSlide className={styles.carousel_element} key={watchObj.id}>
                <img loading="lazy" src={`https://image.tmdb.org/t/p/original${watchObj.backdrop_path}`} alt={watchObj.title ? watchObj.title + " backdrop" : watchObj.name + " backdrop"} />
                <div className={styles.info_container}>

                    <img  loading="lazy" src={`https://image.tmdb.org/t/p/original${watchObj.poster_path}`} alt={watchObj.title ? watchObj.title + " poster" : watchObj.name + " poster"}/>

                    <div className={styles.info_content}>
                        <h1>{watchObj.name ? watchObj.name : watchObj.title}</h1>

                        <span>Release date: {Moment(watchObj.media_type === "movie" ? watchObj.release_date : watchObj.first_air_date).format("DD.MM.YYYY")}</span>

                        <div className={styles.rating_container}>
                            <div className={styles.tmdb_rating_container}>
                                <b>TMDB</b>
                                <div className={styles.rating}><Rating otherRating={Math.round(watchObj.vote_average * 10)} /></div>
                            </div>
                            <div className={styles.mwl_rating_container}>
                                <b>MWL</b>
                                <div className={styles.rating}><Rating isMWL={true} mediaType={watchObj.media_type === "tv" ? "series" : watchObj.media_type} watchObjId={watchObj.id} /></div>
                            </div>
                        </div>
                        <p>{watchObj.overview}</p>
                        <Button width="6vw" onClick={() =>handleClick(watchObj)}>Learn more</Button>
                    </div>

                </div>
            </SwiperSlide>
            )}
        </Swiper>
    );
}

export default WatchObjsCarousel;
