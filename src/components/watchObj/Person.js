import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import styles from '../../css/Person.module.css';
import Moment from 'moment';
import WatchObjsSmCarousel from "../../utilities/WatchObjsSmCarousel";
import {Icons} from "../../utilities/Icons";
import Button from "../../utilities/Button";
import {Helmet} from "react-helmet-async";
import NotFound from "../NotFound";

function Person(props)
{
    let {watchObjId} = useParams();

    const {isWatchObjFound, setIsWatchObjFound} = props;

    const [person, setPerson] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [isReadMore, setIsReadMore] = useState(false);
    const [activeCredits, setActiveCredits] = useState("");
    const [secondSlice, setSecondSlice] = useState(5);

    const biography = person.biography !== undefined && person.biography !== "" ? person.biography.split(`\n\n`) : null;

    const personKnownFor = person.known_for_department === "Acting" ? cast : crew;
    const dataForCarousel =  [...new Map(personKnownFor.map(item => [item[item.title ? "title" : "name"], item])).values()].sort((a, b) => b.vote_count - a.vote_count).filter(item => item.department !== "Crew").slice(0, 10);

    const credits = activeCredits === "Acting" ? cast : crew.filter(item => item.department === activeCredits);
    /*const sortedFilteredCredits = [...new Map(credits.filter(item => item.release_date !== "").map(item => [item[item.title ? "title" : "name"], item])).values()].sort((a, b) => new Date(b.release_date ? b.release_date : b.first_air_date) - new Date(a.release_date ? a.release_date : a.first_air_date));
   */ const sortedFilteredCredits = credits.filter(item => item.release_date !== "").sort((a, b) => new Date(b.release_date ? b.release_date : b.first_air_date) - new Date(a.release_date ? a.release_date : a.first_air_date));

    let personDepartmentBtns = [person.known_for_department];
    if(cast.length > 0) personDepartmentBtns.push("Acting");
    personDepartmentBtns.push(...new Map(crew.map(item => [item["department"], item.department])).values())
    personDepartmentBtns = [...new Set(personDepartmentBtns)];

    useEffect(() =>
    {
        fetch(`https://api.themoviedb.org/3/person/${watchObjId}?api_key=${props.apiKey}&language=en-US&append_to_response=combined_credits`)
            .then(response => response.json())
            .then(data =>
            {
                if(data.status_code === 34) return setIsWatchObjFound(false);

                setIsWatchObjFound(true);

                setPerson(data);
                setCast(data.combined_credits.cast);
                setCrew(data.combined_credits.crew);
            });
    }, [watchObjId]);

    useEffect(() =>
    {
        setActiveCredits(person.known_for_department)
    }, [person])

    const personGender = () =>
    {
        switch(person.gender)
        {
            case 0:
                return "-"
            case 1:
                return "Female"
            case 2:
                return "Male"
        }
    };

    const sortIntoGroupsByYear = (arrayToSort) =>
    {
        let i = 0;
        let j = 0;
        let oldYear = null;
        let currentYear = null;
        const resultArr = [];

        arrayToSort.map(watchObj =>
        {
            oldYear = watchObj.release_date ? Moment(watchObj.release_date).format(`YYYY`) : Moment(watchObj.first_air_date).format(`YYYY`);

            if(j === 0)
            {
                resultArr.push([arrayToSort[j]]);
                j++;
            }else if(currentYear === oldYear)
            {
                resultArr[i].push(arrayToSort[j]);
                j++;
            } else
            {
                currentYear = arrayToSort[j].release_date ? Moment(arrayToSort[j].release_date).format(`YYYY`) : Moment(arrayToSort[j].first_air_date).format(`YYYY`);
                resultArr.push([arrayToSort[j]])
                j++;
                i++;
            }
        })

        return resultArr;
    }

    return (
        <div className={styles.person_container}>
            <Helmet>
                <title>{isWatchObjFound ? person.name : "Not Found" + " | My Watch List"}</title>
            </Helmet>
            {isWatchObjFound ?
                <div className={styles.person_content}>
                    <div className={styles.general_info}>
                        {person.profile_path !== null ?

                            <img src={`https://image.tmdb.org/t/p/original${person.profile_path}`} alt={`${person.name} profile picture`} />
                            :
                            <div className={styles.profile_path_placeholder}>
                                {Icons.person}
                            </div>
                        }

                        {person.homepage !== null &&
                            <div className={styles.homepage}>
                                <Button href={person.homepage} target="_blank" state="tertiary" icon="home" padding="5px 10px 5px 0">Homepage</Button>
                            </div>
                        }

                        <div className={styles.person_personal_info}>
                            <h3>Personal Info</h3>
                            <b>Gender</b>
                            {personGender()}

                            <b>Know for</b>
                            {person.known_for_department}

                            <b>Birthday</b>
                            {person.birthday !== null ? Moment(person.birthday).format("DD MMMM YYYY") : "-"}

                            {person.deathday !== null &&
                                <>
                                    <b>Day of Death</b>
                                    {Moment(person.deathday).format("DD MMMM YYYY")}
                                </>
                            }

                            <b>Place of birth</b>
                            {person.place_of_birth !== null ? person.place_of_birth : "-"}

                        </div>

                    </div>

                    <div className={styles.general_info2}>

                        <h1>{person.name}</h1>

                        <div className={styles.biography_container}>
                            <h3>Biography</h3>

                            {biography !== null ?
                                <div className={styles.biography_paragraphs_container} style={{maxHeight: biography.length > 2 && !isReadMore ? "222px" : "none"}}>
                                    {biography.map(p => <p>{p}</p>)}

                                    {!isReadMore && biography.length > 2 &&
                                        <div className={styles.read_more_container}>
                                            <Button onClick={() => setIsReadMore(true)}  state="noBG" icon="arrowDown" iconPosition="right" height="25px">Read more</Button>
                                        </div>
                                    }
                                </div>
                                : <p style={{position: "static", visibility: "visible"}}>We don't have a biography for {person.name}</p>}
                        </div>

                        <h3>Know For</h3>
                        <div className={styles.known_for}>
                            <WatchObjsSmCarousel data={dataForCarousel} type="person" />
                        </div>

                        <div className={styles.credits_container}>

                            <div className={styles.person_department_btns}>
                                {personDepartmentBtns.map(btn => <Button state={activeCredits === btn ? "primary" : "tertiary"} onClick={() => setActiveCredits(btn)}>{btn}</Button>)}
                            </div>

                            <table className={styles.credits_table}>
                                <tbody>
                                    {credits.filter(item => item.release_date === "").length > 0 &&
                                        <tr>
                                            <td>
                                                {credits.filter(item => item.release_date === "").map(watchObj =>
                                                    <tr key={watchObj.id}>
                                                        <td className={styles.credits_year}>—</td>
                                                        <td className={styles.credits_title}>
                                                            <a href={`/${watchObj.media_type === "tv" ? "series" : watchObj.media_type}/${watchObj.id}`}>
                                                            <b>{watchObj.title ? watchObj.title : watchObj.name}</b></a> <span>{activeCredits === "Acting" && watchObj.character !== "" ? "as " + watchObj.character : watchObj.job && watchObj.job !== "" ? "..." + watchObj.job : null }</span></td>
                                                    </tr>
                                                )}
                                            </td>
                                        </tr>
                                    }
                                    {sortIntoGroupsByYear(sortedFilteredCredits).slice(0, secondSlice).map((arr, index) =>
                                        <tr key={index}>
                                            <td>
                                                {arr.map(watchObj =>
                                                    <tr key={watchObj.id}>
                                                        <td className={styles.credits_year}>{watchObj.release_date ? Moment(watchObj.release_date).format(`YYYY`) : Moment(watchObj.first_air_date).format(`YYYY`)}</td>
                                                        <td className={styles.credits_title}><a href={`/${watchObj.media_type === "tv" ? "series" : watchObj.media_type}/${watchObj.id}`}><b>{watchObj.title ? watchObj.title : watchObj.name}</b></a> <span>{activeCredits === "Acting" && watchObj.character !== "" ? "as " + watchObj.character : watchObj.job && watchObj.job !== "" ? "..." + watchObj.job : null }</span></td>
                                                    </tr>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {sortIntoGroupsByYear(sortedFilteredCredits).length > secondSlice && <div className={styles.show_more_credits}><Button state="tertiary" onClick={() => setSecondSlice(sortIntoGroupsByYear(sortedFilteredCredits).length)}>Show More</Button></div>}
                        </div>
                    </div>
                </div>
            : <NotFound />}
        </div>
    );
}

export default Person;