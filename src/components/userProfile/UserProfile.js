import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Cookies from 'js-cookie'
import Review from "./Review";
import Button from "../../utilities/Button";
import styles from '../../css/UserProfile.module.css'
import Moment from "moment";
import getColors from 'get-image-colors';
import {Helmet} from "react-helmet-async";
import {Icons} from "../../utilities/Icons";

import {handleDelete} from "./WatchlistObjDelete";
import Input from "../../utilities/Input";
import ReactStars from "react-rating-stars-component";
import NotFound from "../NotFound";
import Preloader from "../../utilities/Preloader";

function UserProfile(props)
{
    const {setMessage, setState} = props;

    const [user, setUser] = useState({});
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [isProfileOwner, setIsProfileOwner] = useState(false);
    const [imageColors, setImageColors] = useState([]);

    const {username} = useParams();
    const url = Cookies.get('token') ? `https://mywatchlist-apiv2.herokuapp.com/user/one/${username}/${Cookies.get('token')}` : `https://mywatchlist-apiv2.herokuapp.com/user/one/${username}`;

    const [clickedId, setClickedId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    const [isReviewClicked, setIsReviewClicked] = useState(false);
    const [review, setReview] = useState("");
    const [score, setScore] = useState(null);
    const [isCheckDisabled, setIsCheckDisabled] = useState(true);

    const [isWatchStatusClicked, setIsWatchStatusClicked] = useState(false);
    const [watchStatus, setWatchStatus] = useState("");
    const [isWatchStatusHovered, setIsWatchStatusHovered] = useState(false);

    const [filter, setFilter] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [isMediaType, setIsMediaType] = useState(false);

    const [starKeyForce, setStarKeyForce] = useState(0);

    let userWatchlistFiltered = filter.length && !isMediaType ? userWatchlist.filter(item => item.watchStatus === filter) : isMediaType ? userWatchlist.filter(item => item.watchObject[filter]) : userWatchlist;
    userWatchlistFiltered = userWatchlistFiltered.filter(item => item.watchObject.title ? item.watchObject.title.toLowerCase().includes(filterSearch.toLowerCase()) : item.watchObject.name.toLowerCase().includes(filterSearch.toLowerCase()));

    useEffect(() =>
    {
        fetch(url)
            .then(response => response.json())
            .then(data =>
            {
                if (data.error) throw new Error(data.error);

                setUser(data.user);
                setUserWatchlist(data.user.watchlistArr);
                setIsProfileOwner(data.own);
            })
            .catch(err =>
            {
                if(err.message !== "User not found")
                {
                    setMessage(err.message);
                    setState("error");
                }
            })
    }, []);

    useEffect(() =>
    {
        if(user.userProfilePic !== undefined)
        {
            getColors(`https://mywatchlist-apiv2.herokuapp.com/${user.userProfilePic}`).then(colors =>
            {
                colors.map(color => setImageColors(prev => [color.hex(), ...prev]));
            })
        }

    }, [user.userProfilePic !== undefined]);

    useEffect(() =>
    {
        if(isReviewClicked)
        {
            userWatchlist.map(watchObj =>
            {
                if(review !== watchObj.review || score !== watchObj.score || watchStatus !== watchObj.watchStatus)
                {
                    setIsCheckDisabled(false);
                } else
                {
                    setIsCheckDisabled(true);
                }
            });
        }
    }, [review, score, watchStatus]);

    useEffect(() =>
    {
        setStarKeyForce(prev => prev + 1)
    }, [isReviewClicked, userWatchlist]);

    const convertWatchStatusToIcon = (watchStatus) =>
    {
        switch (watchStatus)
        {
            case "Dropped":
                return "statusDropped";
            case "Plan to watch":
                return "statusPlanToWatch";
            case "Postponed":
                return "statusPostponed";
            case "Currently watching":
                return "statusWatching";
            case "Completed":
                return "statusCompleted";
            default:
                return "statusPlanToWatch";
        }
    }

    const changeWatchStatus = (watchObjId, status) =>
    {
        let watchStatus;

        switch (status)
        {
            case "statusDropped":
                watchStatus = "Dropped";
                setWatchStatus("statusDropped");
                break;
            case "statusPlanToWatch":
                watchStatus = "Plan to watch";
                setWatchStatus("statusPlanToWatch");
                break;
            case "statusPostponed":
                watchStatus = "Postponed";
                setWatchStatus("statusPostponed");
                break;
            case "statusWatching":
                watchStatus = "Currently watching";
                setWatchStatus("statusWatching");
                break;
            case "statusCompleted":
                watchStatus = "Completed";
                setWatchStatus("statusCompleted");
                break;
        }

        fetch(`https://mywatchlist-apiv2.herokuapp.com/user/review/${watchObjId}`,
            {
                method: "PATCH",
                headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "watchStatus": watchStatus
                    })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);

                setUserWatchlist(data.watchlistArr);
                setIsWatchStatusClicked(false);
            })
            .catch(err => {
                setMessage(err.message);
                setState("error");
            })
    }

    const handleRightArrowClick = () =>
    {
        if(userWatchlistFiltered.map(el => el.id).indexOf(clickedId) !== userWatchlistFiltered.length - 1 && !isReviewClicked)
        {
            const watchlistIndex = userWatchlistFiltered.map(el => el.id).indexOf(clickedId) + 1;

            setClickedId(userWatchlistFiltered[watchlistIndex].id);

            setScore(userWatchlistFiltered[watchlistIndex].score);
            setWatchStatus(convertWatchStatusToIcon(userWatchlistFiltered[watchlistIndex].watchStatus));
            setReview(userWatchlistFiltered[watchlistIndex].review);

            return;
        }

        return null;
    }

    const handleLeftArrowClick = () =>
    {
        if(userWatchlistFiltered.map(el => el.id).indexOf(clickedId) > 0 && !isReviewClicked)
        {
            const watchlistIndex = userWatchlistFiltered.map(el => el.id).indexOf(clickedId) - 1;

            setClickedId(userWatchlistFiltered[watchlistIndex].id);

            setScore(userWatchlistFiltered[watchlistIndex].score);
            setWatchStatus(convertWatchStatusToIcon(userWatchlistFiltered[watchlistIndex].watchStatus));
            setReview(userWatchlistFiltered[watchlistIndex].review);

            return;
        }
        return null;
    }

    const btnState = (bntFilter, isFilterMedia) =>
    {
        if(isFilterMedia)
        {
            return filter === bntFilter ? "primary" : userWatchlist.filter(item => item.watchObject[bntFilter]).length !== 0 ? "tertiary" : "disabled";
        } else
        {
            return filter === bntFilter ? "primary" : userWatchlist.filter(item => item.watchStatus === bntFilter).length !== 0 ? "tertiary" : "disabled";
        }
    }

    const ratingChanged = (newRating) =>
    {
        if(newRating !== 0)
        {
            setScore(newRating);
        }
    };

    return (
        <div className={styles.user_container}>
            <Preloader loading={Object.keys(user).length === 0} />

            <Helmet>
                <title>{user.username + " | My Watch List"}</title>
            </Helmet>

            {Object.keys(user).length > 0 ?
                <div className={styles.user_info_container}>
                    <div className={styles.user_info}>

                        <div className={styles.profile_pic}>
                            <div className={styles.profile_pic_background} style={{borderImage:
                                    `linear-gradient(to right top, ${imageColors.map(color => color)}) 1`}} />
                            <img src={user.userProfilePic} alt={user.username + " profile picture"}/>
                        </div>

                        <div className={styles.username}>
                            <h1>{user.username}</h1>
                            <b>Joined {Moment(user.createdAt).format('DD MMMM YYYY')}</b>
                            {isProfileOwner &&
                                <div style={{display: "flex"}}><Button state="ghost" icon="gear" href="/settings">Settings</Button></div>
                            }
                        </div>
                    </div>

                    <h2>Watchlist</h2>

                    <div className={styles.filter_container}>
                        <Input type="search" fontSize="16px" height="10px" placeholder="Search in watchlist (e.g: Top Gun)" onChange={e => setFilterSearch(e.target.value)} />
                        <div className={styles.filter_buttons_container}>
                            <div className={styles.filter_buttons}>
                                <Button state={filter === "" ? "primary" : "tertiary"} onClick={() =>
                                {
                                    setFilter("");
                                    setIsMediaType(false);
                                }}>All</Button>
                                <Button state={btnState("Dropped")} icon="statusDropped" onClick={() => setFilter("Dropped")}>Dropped ({userWatchlist.filter(item => item.watchStatus === "Dropped").length})</Button>
                                <Button state={btnState("Plan to watch")} icon="statusPlanToWatch" onClick={() => setFilter("Plan to watch")}>Plan to watch ({userWatchlist.filter(item => item.watchStatus === "Plan to watch").length})</Button>
                                <Button state={btnState("Postponed")} icon="statusPostponed" onClick={() => setFilter("Postponed")}>Postponed ({userWatchlist.filter(item => item.watchStatus === "Postponed").length})</Button>
                                <Button state={btnState("Currently watching")} icon="statusWatching" onClick={() => setFilter("Currently watching")}>Currently watching ({userWatchlist.filter(item => item.watchStatus === "Currently watching").length})</Button>
                                <Button state={btnState("Completed")} icon="statusCompleted" onClick={() => setFilter("Completed")}>Completed ({userWatchlist.filter(item => item.watchStatus === "Completed").length})</Button>
                            </div>

                            <div className={styles.media_type_buttons}>
                                <Button state={btnState("title", true)} icon="movieClapper" onClick={() =>
                                {
                                    setFilter("title");
                                    setIsMediaType(true);
                                }}>Movie ({userWatchlist.filter(item => item.watchObject.title).length})</Button>
                                <Button state={btnState("name", true)} icon="seriesTv" onClick={() =>
                                {
                                    setFilter("name");
                                    setIsMediaType(true);
                                }}>Series ({userWatchlist.filter(item => item.watchObject.name).length})</Button>
                            </div>

                        </div>
                    </div>

                    <div className={styles.watchlist_container}>
                        <div className={styles.watchlist_items_container}>

                            {userWatchlistFiltered.length === 0 &&
                                <div className={styles.empty_watchlist_container}>
                                    Nothing found!
                                </div>
                            }

                            {userWatchlistFiltered.map(watchArrItem =>
                                <div key={watchArrItem.id}>
                                    <div className={styles.watchlist_item} onClick={() =>
                                    {
                                        setClickedId(watchArrItem.id);
                                        setIsWatchStatusClicked(false);

                                        setScore(watchArrItem.score);
                                        setWatchStatus(convertWatchStatusToIcon(watchArrItem.watchStatus));
                                        setReview(watchArrItem.review);
                                    }}
                                    onMouseOver={() => setHoveredId(watchArrItem.id)}
                                    onMouseLeave={() => setHoveredId(null)}>
                                        {isProfileOwner && <div className={styles.delete_btn} title="Delete from watchlist"
                                        onClick={e =>
                                        {
                                            e.stopPropagation();
                                            handleDelete(setUserWatchlist, setMessage, setState, watchArrItem.id)
                                        }}>{Icons.delete}</div>}

                                        <a style={{all: "unset"}} href={`/${watchArrItem.watchObject.name ? "series" : "movie"}/${watchArrItem.watchObject.id}`}><div className={styles.external_link} title="Delete from watchlist" onClick={e => e.stopPropagation()}>{Icons.externalLink}</div></a>

                                        <div className={styles.poster}>
                                            {watchArrItem.watchObject.poster_path &&
                                                <img src={`https://image.tmdb.org/t/p/original${watchArrItem.watchObject.poster_path}`} alt={watchArrItem.watchObject.title ? watchArrItem.watchObject.title + " poster" : watchArrItem.watchObject.name + " poster"} />
                                            }

                                            {!watchArrItem.watchObject.poster_path &&
                                                <div className={styles.poster_placeholder}>
                                                    {Icons.movieClapper}
                                                    <b>{watchArrItem.watchObject.title ? watchArrItem.watchObject.title : watchArrItem.watchObject.name}</b>
                                                </div>
                                            }
                                        </div>


                                        <div onClick={e =>
                                        {
                                            e.stopPropagation();
                                            setIsWatchStatusClicked(current => !current);
                                            setWatchStatus(convertWatchStatusToIcon(watchArrItem.watchStatus));

                                            setClickedId(!isWatchStatusClicked ? watchArrItem.id : null);

                                        }} className={styles.watch_status} title={watchArrItem.watchStatus} onMouseOver={() => setIsWatchStatusHovered(true)} onMouseLeave={() => setIsWatchStatusHovered(false)} style={{borderRadius: isWatchStatusClicked && clickedId === watchArrItem.id ? "10px 10px 0 0" : null, background: isProfileOwner && isWatchStatusHovered && hoveredId === watchArrItem.id ? "#29292FFF" : null}}>
                                            <div className={styles.watch_status_icon} style={{color: isProfileOwner && isWatchStatusHovered && hoveredId === watchArrItem.id ? "#7F5AF0CC" : null}}>{Icons[convertWatchStatusToIcon(watchArrItem.watchStatus)]}</div>

                                            {isWatchStatusClicked && isProfileOwner && clickedId === watchArrItem.id &&
                                                <ul className={styles.select_watch_status} onMouseOver={e =>
                                                {
                                                    e.stopPropagation();
                                                    setIsWatchStatusHovered(false);
                                                }}>
                                                    {convertWatchStatusToIcon(watchArrItem.watchStatus) !== "statusDropped" && <li title="Dropped" onClick={() => changeWatchStatus(watchArrItem.id, "statusDropped")}>{Icons.statusDropped}</li>}
                                                    {convertWatchStatusToIcon(watchArrItem.watchStatus) !== "statusPlanToWatch" && <li title="Plan to watch" onClick={() => changeWatchStatus(watchArrItem.id, "statusPlanToWatch")}>{Icons.statusPlanToWatch}</li>}
                                                    {convertWatchStatusToIcon(watchArrItem.watchStatus) !== "statusPostponed" && <li title="Postponed" onClick={() => changeWatchStatus(watchArrItem.id, "statusPostponed")}>{Icons.statusPostponed}</li>}
                                                    {convertWatchStatusToIcon(watchArrItem.watchStatus) !== "statusWatching" && <li title="Currently watching" onClick={() => changeWatchStatus(watchArrItem.id, "statusWatching")}>{Icons.statusWatching}</li>}
                                                    {convertWatchStatusToIcon(watchArrItem.watchStatus) !== "statusCompleted" && <li title="Completed" onClick={() => changeWatchStatus(watchArrItem.id, "statusCompleted")}>{Icons.statusCompleted}</li>}
                                                </ul>
                                            }
                                        </div>
                                    </div>

                                    {clickedId === watchArrItem.id && !isWatchStatusClicked &&
                                        <div className={styles.item_user_info_container} onClick={() =>
                                        {
                                            setIsReviewClicked(false);
                                            setIsCheckDisabled(true);
                                            setClickedId(null);
                                        }}>
                                            <div className={styles.item_content_container} onClick={e => e.stopPropagation()}>
                                                {userWatchlistFiltered.length > 1 &&
                                                    <div className={styles.left_arrow}
                                                         onClick={() => handleLeftArrowClick()}
                                                         style={{color: userWatchlistFiltered.map(el => el.id).indexOf(clickedId) <= 0 || isReviewClicked ? "grey" : null}}>{Icons.arrowLeft}</div>
                                                }
                                                <div className={styles.item_user_content}>

                                                    {watchArrItem.watchObject.poster_path &&
                                                        <img src={`https://image.tmdb.org/t/p/original${watchArrItem.watchObject.poster_path}`} alt={watchArrItem.watchObject.title ? watchArrItem.watchObject.title + " poster" : watchArrItem.watchObject.name + " poster"} />
                                                    }

                                                    {!watchArrItem.watchObject.poster_path &&
                                                        <div className={styles.poster_placeholder_user_info}>
                                                            {Icons.movieClapper}
                                                        </div>
                                                    }
                                                    <div className={styles.item_content}>
                                                        <div className={styles.item_top}>
                                                            <h3>{watchArrItem.watchObject.title ? watchArrItem.watchObject.title : watchArrItem.watchObject.name}</h3>
                                                            <Review watchObjId={watchArrItem.id}
                                                                    score={score}
                                                                    review={review}
                                                                    watchStatus={watchStatus}

                                                                    setMessage={setMessage}
                                                                    setState={setState}

                                                                    setUserWatchlist={setUserWatchlist}

                                                                    isReviewClicked={isReviewClicked}
                                                                    setIsReviewClicked={setIsReviewClicked}

                                                                    isCheckDisabled={isCheckDisabled}
                                                                    setIsCheckDisabled={setIsCheckDisabled}/>
                                                            <Button title="Close" state="tertiary" icon="close" onClick={() =>
                                                            {
                                                                setIsReviewClicked(false);
                                                                setIsCheckDisabled(true);
                                                                setClickedId(null);
                                                            }}/>
                                                        </div>

                                                        <div className={styles.item_user_status}>
                                                            <span>
                                                                <b>User score</b> {watchArrItem.score === null && !isReviewClicked ? "-" :
                                                                <ReactStars
                                                                    count={5}
                                                                    size={24}
                                                                    value={watchArrItem.score !== null ? parseFloat(watchArrItem.score) : watchArrItem.score}
                                                                    isHalf={true}
                                                                    onChange={ratingChanged}
                                                                    edit={isReviewClicked}
                                                                    emptyIcon={Icons.star}
                                                                    halfIcon={Icons.halfStar}
                                                                    filledIcon={Icons.star}
                                                                    key={starKeyForce} />}
                                                            </span>
                                                            <span>
                                                                <b>Status</b>
                                                                {!isReviewClicked && <span>{watchArrItem.watchStatus}</span>}
                                                                {isReviewClicked &&
                                                                    <select onChange={e => setWatchStatus(e.target.options[e.target.selectedIndex].value)} value={watchStatus}>
                                                                        <option value="statusDropped">Dropped</option>
                                                                        <option value="statusPlanToWatch">Plan to watch</option>
                                                                        <option value="statusPostponed">Postponed</option>
                                                                        <option value="statusWatching">Currently watching</option>
                                                                        <option value="statusCompleted">Completed</option>
                                                                    </select>
                                                                }
                                                            </span>
                                                        </div>

                                                        <b>Review</b>

                                                        {!isReviewClicked && <p>{watchArrItem.review.trim().length ? watchArrItem.review : `${user.username} has not reviewed "${watchArrItem.watchObject.title ? watchArrItem.watchObject.title : watchArrItem.watchObject.name}" yet.`}</p>}

                                                        {isReviewClicked && <textarea onChange={e => setReview(e.target.value)} value={review} />}

                                                    </div>
                                                </div>

                                                {userWatchlistFiltered.length > 1 &&
                                                    <div className={styles.right_arrow}
                                                    onClick={() => handleRightArrowClick()}
                                                    style={{color: userWatchlistFiltered.map(el => el.id).indexOf(clickedId) === userWatchlistFiltered.length - 1 || isReviewClicked ? "grey" : null}}>{Icons.arrowRight}</div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            : <NotFound />}
        </div>
    );
}

export default UserProfile;