import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Icons} from '../../utilities/Icons';
import styles from '../../css/Search.module.css'
import Button from "../../utilities/Button";

function SearchBar(props)
{
    const [userQuery, setUserQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const navigate = useNavigate();

    const searchReq = `https://api.themoviedb.org/3/search/multi?api_key=${props.apiKey}&language=en-US&query=${userQuery}&page=1&include_adult=false`;

    useEffect(() =>
    {
        if(userQuery !== "")
        {
            const fetchTimeout = setTimeout(() =>
            {
                fetch(searchReq)
                    .then(response => response.json())
                    .then(data =>
                    {
                        setSearchResult(data);
                    });

            }, 500);

            return () =>
            {
                clearInterval(fetchTimeout);
                setSearchResult([]);
            };
        }
    }, [userQuery])

    const handleClick = (result) =>
    {
        switch (result.media_type)
        {
            case "tv":
                navigate(`/series/${result.id}`);
                break;
            case "person":
                navigate(`/person/${result.id}`);
                break;
            default:
                navigate(`/movie/${result.id}`);
                break;
        }

        return setUserQuery("");
    }

    const handleShowMore = (searchResult, userQuery) =>
    {
        navigate(`/search?query=${userQuery.replace(" ", "+")}`, {state: {searchResults: searchResult}});
        setSearchResult([]);
    }

    return (
        <div className={styles.search_container}>
            <div className={styles.search_input} style={{boxShadow: userQuery !== "" ? "0 0 20px rgb(0, 0, 0)" : null}}>
                <div className={styles.search_icon}>{Icons.search}</div><input type="search" value={userQuery} onChange={event => setUserQuery(event.target.value)} placeholder="Search" />
            </div>

            {userQuery !== "" &&
                <div className={styles.search_result_container}>

                    {searchResult.total_results === 0 && <div className={styles.empty_response}>Nothing found :(</div>}

                    {searchResult.total_results > 0 &&
                        <div className={styles.search_result}>
                            {searchResult.results.slice(0, 3).map(result =>
                                <div key={result.id} onClick={() => handleClick(result)} className={styles.search_result_content}>

                                    {result.poster_path !== null && result.profile_path !== null &&
                                        <img src={`https://image.tmdb.org/t/p/original${result.poster_path ? result.poster_path : result.profile_path}`} alt={result.title ? result.title + " poster" : result.name + " poster"}/>
                                    }

                                    {!result.poster_path && !result.profile_path &&
                                        <div className={styles.poster_placeholder}>
                                            {result.media_type === "person" ? Icons.person : Icons.movieClapper}
                                        </div>
                                    }


                                    <div className={styles.result_info}>
                                        <h4>{result.media_type === "tv" || result.media_type === "person" ? result.name : result.title}</h4>
                                        <p>{result.overview ? result.overview.slice(0, 50) + "..." : "Known for: " + result.known_for_department}</p>
                                    </div>

                                </div>
                            )}
                        </div>
                    }

                    {searchResult.total_results > 3 &&
                        <div className={styles.more_results_btn}>
                                <Button onClick={() => handleShowMore(searchResult, userQuery)}>Show more ({searchResult.total_results - 3})</Button>
                        </div>
                    }

                </div>
            }
        </div>
    );

}

export default SearchBar;