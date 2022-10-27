import React, {useEffect, useState} from 'react';
import styles from './css/WatchObj.module.css'
import HandleWatchlist from "../components/watchObj/watchObjComp/HandleWatchlist";
import {useNavigate, useParams} from "react-router-dom";
import Rating from "../components/watchObj/watchObjComp/Rating";
import Moment from 'moment';
import Button from "./Button";
import WatchObjsSmCarousel from "./WatchObjsSmCarousel";
import {Icons} from "./Icons";
import actorImgPlaceholder from "../assets/actorImgPlaceholder.png";
import {Helmet} from "react-helmet-async";
import NotFound from "../components/NotFound";
import Preloader from "./Preloader";

function WatchObj(props)
{
    const {setMessage, setState, isWatchObjFound, setIsWatchObjFound} = props;

    const [watchObjData, setWatchObjData] = useState({});

    const [similar, setSimilar] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [cast, setCast] = useState([]);
    const [trailerLinks, setTrailerLinks] = useState([]);

    const [showTrailer, setShowTrailer] = useState(false);
    const [showMoreCast, setShowMoreCast] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const {watchObjId} = useParams();
    const {mediaType} = useParams();
    const navigate = useNavigate();

    useEffect(() =>
    {
        fetch(`https://api.themoviedb.org/3/${mediaType === "series" ? "tv" : mediaType}/${watchObjId}?api_key=${props.apiKey}&language=en-US&append_to_response=videos,${mediaType === "movie" ? "credits" : "aggregate_credits"},recommendations,similar`)
            .then(response => response.json())
            .then(data =>
            {
                if(data.status_code === 34)
                {
                    setIsWatchObjFound(false);
                    setIsLoading(false);

                    return;
                }

                setWatchObjData(data);
                setSimilar(data.similar.results);
                setRecommendations(data.recommendations.results);
                setTrailerLinks(data.videos.results.map(video => video.key));
                setCast(data.credits ? data.credits.cast : data.aggregate_credits.cast);

                setMessage("");
                setState("");

                setIsWatchObjFound(true);
                setIsLoading(false);
            })
            .catch(err =>
            {
                setMessage(err.message);
                setState("error");
            });
    }, [watchObjId]);

    const title = watchObjData.name ? watchObjData.name : watchObjData.title ? watchObjData.title : "Not Found";
    const trailerLink = trailerLinks !== null ? trailerLinks[trailerLinks.length - 1] : null;

    const clearWatchObjData = watchObjData;
    delete clearWatchObjData["videos"];
    delete clearWatchObjData["credits"];
    delete clearWatchObjData["aggregate_credits"];
    delete clearWatchObjData["recommendations"];
    delete clearWatchObjData["similar"];

    return (
        <div style={{fontSize: "1.8vh"}}>
            <Preloader loading={isLoading} />

            <Helmet>
                <title>{title + " | My Watch List"}</title>
            </Helmet>
            {isWatchObjFound ?
            <>
                <div className={styles.watchObject_container} style={{backgroundImage: `linear-gradient(to left, rgba(22, 22, 26, 0) 0%, rgba(22, 22, 26, 1) 80%), linear-gradient(to bottom, rgba(22, 22, 26, 0) 90%, rgba(22, 22, 26, 1) 100%), url(https://image.tmdb.org/t/p/original${watchObjData.backdrop_path})`}}>
                    <div className={styles.watchObj_content}>
                        <div className={styles.title}>
                            <h1>{title}</h1> {watchObjData.release_date !== "" && watchObjData.first_air_date !== "" && <span>({Moment(mediaType === "movie" ? watchObjData.release_date : watchObjData.first_air_date).format('YYYY')})</span>}
                            {trailerLinks.length !== 0 && <Button state="tertiary" icon="play" onClick={() => setShowTrailer(true)}>Watch trailer</Button>}
                        </div>

                        {showTrailer &&
                            <div className={styles.watchObj_trailer} onClick={() => setShowTrailer(false)}>
                                <div className={styles.close_trailer}><Button state="tertiary" icon="close" onClick={() => setShowTrailer(false)}/></div>
                                <iframe width="66.6666%" height="76%" src={`https://www.youtube.com/embed/${trailerLink}`}
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen/>
                            </div>
                        }

                        <div className={styles.general_info}>
                            {(watchObjData.release_date !== "" && watchObjData.first_air_date !== "") || (watchObjData.runtime !== undefined && watchObjData.runtime.length > 0) || (watchObjData.episode_run_time !== undefined && watchObjData.episode_run_time.length > 0 )?
                            <ul>
                                {watchObjData.release_date !== "" && watchObjData.first_air_date !== "" && <li>{Moment(mediaType === "movie" ? watchObjData.release_date : watchObjData.first_air_date).format(`DD.MM.YYYY`)}</li>}

                                {(watchObjData.runtime !== undefined && watchObjData.runtime.length > 0) || (watchObjData.episode_run_time !== undefined && watchObjData.episode_run_time.length > 0) ?
                                    <>
                                        {mediaType === "movie" && <li>{Math.floor(watchObjData.runtime / 60) + "h " + Math.round(( (watchObjData.runtime / 60 - Math.floor(watchObjData.runtime / 60 ) ) * 60)) + "m" }</li>}
                                        {mediaType === "series" && <li>Episodes runtime: {watchObjData.episode_run_time !== undefined ? Math.floor(watchObjData.episode_run_time[0] / 60) + "h " + Math.round(( (watchObjData.episode_run_time[0] / 60 - Math.floor(watchObjData.episode_run_time[0] / 60 ) ) * 60)) + "m" : null}</li>}
                                    </>
                                : null}
                            </ul> : null}

                            {watchObjData.genres ? watchObjData.genres.map(genre =>
                                <div className={styles.genres} key={genre.id}>
                                    {genre.name}
                                </div>
                            ) : null}

                        </div>

                        <div className={styles.general_info2}>
                            <div className={styles.rating_container}>
                                <div className={styles.tmdb_rating_container}>
                                    <b>TMDB</b>
                                    <div className={styles.rating}><Rating otherRating={Math.round(watchObjData.vote_average * 10)} /></div>
                                </div>

                                <div className={styles.mwl_rating_container}>
                                    <b>MWL</b>
                                    <div className={styles.rating}><Rating isMWL={true} watchObjId={watchObjId} mediaType={mediaType} /></div>
                                </div>
                            </div>

                            {mediaType === "series" &&
                                <div className={styles.seasons_info}>
                                    Seasons: {watchObjData.number_of_seasons}<br />
                                    Episodes: {watchObjData.number_of_episodes}
                                </div>
                            }

                            Status: {watchObjData.status}

                        </div>
                        {watchObjData.homepage !== null && watchObjData.homepage !== "" &&
                            <div className={styles.homepageBtn}><Button href={watchObjData.homepage} target="_blank" state="tertiary" icon="home" padding="5px 10px 5px 0">Homepage</Button></div>
                        }

                        <div className={styles.overview}>
                            <span className={styles.tagline}><i>{watchObjData.tagline}</i></span>
                            <h2>Overview</h2>
                            <p>{watchObjData.overview !== "" ? watchObjData.overview : `We don't have overview for ${title}`}</p>
                        </div>

                        <HandleWatchlist watchObj={clearWatchObjData} watchObjId={watchObjId} setMessage={setMessage} setState={setState}/>
                    </div>
                </div>

                {cast.length > 10 &&
                    <div className={styles.cast_container}>
                        <div className={styles.cast_title}>
                            <h2>Cast</h2>
                            <Button state="tertiary" icon="arrowRight" iconPosition="right" onClick={() => setShowMoreCast(true)}>View more</Button>
                        </div>
                        <div className={styles.persons_container}>
                            {cast.slice(0, 10).map(person =>
                                <div key={person.id} className={styles.person} onClick={() => navigate(`/person/${person.id}`)}>

                                    <img src={person.profile_path !== null ? `https://image.tmdb.org/t/p/original${person.profile_path}` : actorImgPlaceholder} alt={person.name + " profile picture"} />

                                    <div className={styles.person_info}>
                                        <b>{person.name}</b>
                                        {mediaType === "movie" ? person.character : person.roles !== undefined ? person.roles.length > 2 ? person.roles.slice(0, 2).map(role => role.character + ` `) + ` and ${person.roles.length - 2} more...` : person.roles.map(role => role.character) : null}
                                        {mediaType === "series" && <span>{person.total_episode_count} Episodes</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }

                {showMoreCast &&
                    <div className={styles.more_cast_container} onClick={() => setShowMoreCast(false)}>
                        <div className={styles.more_cast} onClick={e => e.stopPropagation()}>
                            <div className={styles.more_cast_top}>
                                <h2>Cast</h2>
                                <Button state="tertiary" icon="close" onClick={() => setShowMoreCast(false)}/>
                            </div>
                            <div className={styles.more_cast_info}>
                                {cast.map(person =>
                                    <div key={person.id} className={styles.more_cast_person}>

                                        {person.profile_path !== null ?

                                            <img src={`https://image.tmdb.org/t/p/original${person.profile_path}`} onClick={() => navigate(`/person/${person.id}`)} alt={person.name + " profile picture"} />
                                        :
                                            <div className={styles.profile_path_placeholder_more} onClick={() => navigate(`/person/${person.id}`)}>
                                                {Icons.person}
                                            </div>
                                        }


                                        <div className={styles.more_cast_person_info}>
                                            <b>{person.name}</b>
                                            {mediaType === "movie" ? person.character : person.roles.length > 2 ? person.roles.slice(0, 2).map(role => role.character + ` `) + ` and ${person.roles.length - 2} more...` : person.roles.map(role => role.character)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }

                {similar.length !== 0 &&
                    <>
                        <h2>Similar to {watchObjData.title ? watchObjData.title : watchObjData.name}</h2>
                        <WatchObjsSmCarousel data={similar} mediaType={mediaType} />
                    </>
                }

                {recommendations.length !== 0 &&
                    <>
                        <h2>Recommendations</h2>
                        <WatchObjsSmCarousel data={recommendations} mediaType={mediaType} />
                    </>
                }
            </>
            :
                <NotFound />
            }
        </div>
    );
}

export default WatchObj;