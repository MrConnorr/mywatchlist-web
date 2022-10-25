import React, {useEffect, useState} from 'react';
import styles from './css/WatchObjList.module.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import Button from "./Button";
import { Icons } from './Icons';
import Moment from "moment/moment";
import {Helmet} from "react-helmet-async";
import Rating from "../components/watchObj/watchObjComp/Rating";

function WatchObjList(props)
{
    const {data, mediaType} = props;
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [hoveredObjId, setHoveredObjId] = useState(null);

    const currentPage = parseInt(searchParams.get('page')) || 1;

    const pages = [];
    const [firstSlice, setFirstSlice] = useState(null);
    const [secondSlice, setSecondSlice] = useState(null);

    const totalPages = data.total_pages > 500 ? 500 : data.total_pages;

    for(let i = 1; i <= totalPages; i++)
    {
        pages.push(i);
    }

    useEffect(() =>
    {
        setFirstSlice(currentPage === 1 && currentPage !== secondSlice ? 0 : currentPage >= pages[pages.length - 4] ? pages[pages.length - 6] : currentPage - 2);
        setSecondSlice(currentPage === 1 && currentPage !== 3 ? 4 : currentPage >= pages[pages.length - 4] ? pages[pages.length - 1] : currentPage + 2);
    }, [currentPage]);

    const handleClick = (watchObj) =>
    {
        if(mediaType) return navigate(`/${mediaType === "movies" ? "movie" : mediaType}/${watchObj.id}`);

        navigate(`/${watchObj.media_type === "tv" ? "series" : watchObj.media_type}/${watchObj.id}`);
    }

    const title = (title) =>
    {
        return title.length > 52 ? title.slice(0, 52) + "..." : title
    }

    return (
        <div className={styles.container}>
            <Helmet>
                <title>{mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) + " | My Watch List" : searchParams.get(`query`) + " | My Watch List"}</title>
            </Helmet>
            <div className={styles.watchObj_element_container}>

                {currentPage > totalPages || data.length === 0 || data.results.length === 0 ?
                    <div className={styles.no_result}>
                        <h1>There are no results that matched your query.</h1>
                    </div>
                : null}

                {data.results ? data.results.map(watchObj =>
                    <div className={styles.watchObj_content} key={watchObj.id}
                         onClick={() => handleClick(watchObj)}
                         onMouseOver={() => setHoveredObjId(watchObj.id)}
                         onMouseLeave={() => setHoveredObjId(null)}>
                        <div className={styles.poster}>

                            {watchObj.poster_path !== null && watchObj.profile_path !== null &&
                                <img src={`https://image.tmdb.org/t/p/original${watchObj.poster_path ? watchObj.poster_path : watchObj.profile_path}`} alt={watchObj.title ? watchObj.title + " poster" : watchObj.name + " profile picture"} />
                            }

                            {!watchObj.poster_path && !watchObj.profile_path &&
                                <div className={styles.poster_placeholder}>
                                    {watchObj.media_type === "person" ? Icons.person : Icons.movieClapper}
                                </div>
                            }
                        </div>

                        {hoveredObjId === watchObj.id &&
                            <div className={styles.watchObj_info}>

                                <h4>{title(watchObj.title ? watchObj.title : watchObj.name)}</h4>
                                <div style={{display: watchObj.release_date || watchObj.first_air_date ? "flex" : "none" }}>Release date: {Moment(watchObj.release_date ? watchObj.release_date : watchObj.first_air_date ? watchObj.first_air_date : null).format("DD.MM.YYYY")}</div>
                                <div style={{display: watchObj.media_type !== "person" ? "flex" : "none" }} className={styles.rating_container}>
                                    <div className={styles.tmdb_rating_container}>
                                        <b>TMDB</b>
                                        <div className={styles.rating}><Rating otherRating={Math.round(watchObj.vote_average * 10)} /></div>
                                    </div>
                                    <div className={styles.mlw_rating_container}>
                                        <b>MWL</b>
                                        <div className={styles.rating}><Rating isMWL={true} mediaType={watchObj.media_type ? watchObj.media_type : mediaType === "movies" ? "movie" : mediaType} watchObjId={watchObj.id}/></div>
                                    </div>
                                </div>
                                <p>{watchObj.overview ? watchObj.overview.length > 100 ? watchObj.overview.slice(0, 100) + "..." : watchObj.overview : watchObj.known_for_department ? "Known for: " + watchObj.known_for_department : null}</p>
                                <Button onClick={() => handleClick(watchObj)}>Learn more</Button>
                            </div>
                        }

                    </div>

                ) : null}

            </div>

            {totalPages > 1 && currentPage <= totalPages &&
                <div className={styles.pages_container}>
                    <Button state={currentPage !== 1 ? "secondary" : "disabled"} icon="arrowDoubleLeft" onClick={() => setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: pages[0]} : {page: pages[0]})} />
                    <Button state={currentPage !== 1 ? "secondary" : "disabled"} icon="arrowLeft" onClick={() => setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: currentPage - 1} : {page: currentPage - 1})} />

                    {currentPage >= pages[pages.length - 4] &&
                        <>
                            <Button state="secondary" onClick={() => setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: pages[0]} : {page: pages[0]})}>{pages[0]}</Button>
                            ...
                        </>
                    }

                    {pages.slice(firstSlice, secondSlice).map(page =>
                        <Button key={page} state={currentPage === page ? "primary" : "secondary"} onClick={() => currentPage !== page ? setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: page} : {page: page}) : null}>{page}</Button>
                    )}

                    {secondSlice <= pages[pages.length - 3] &&
                        <>
                            ...
                            <Button state="secondary" onClick={() => setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: pages[pages.length - 1]} : {page: pages[pages.length - 1]})}>{pages[pages.length - 1]}</Button>
                        </>
                    }
                    <Button state={currentPage !== pages[pages.length - 1] ? "secondary" : "disabled"} icon="arrowRight" onClick={() => setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: currentPage + 1} : {page: currentPage + 1})} />
                    <Button state={currentPage !== pages[pages.length - 1] ? "secondary" : "disabled"} icon="arrowDoubleRight" onClick={() => setSearchParams(searchParams.get(`query`) ? {query: searchParams.get("query"), page: pages[pages.length - 1]} : {page: pages[pages.length - 1]})} />
                </div>
            }
        </div>
    );
}

export default WatchObjList;