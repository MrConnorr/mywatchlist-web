import React, {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from "react-router-dom";
import WatchObjList from "../utilities/WatchObjList";

function SearchList(props)
{
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();

    const [searchParams] = useSearchParams();

    useEffect(() =>
    {
        switch(location.state)
        {
            case true:
                setSearchResults(location.state.searchResults);
                break;
            default:
                if(searchParams.get("query") !== null)
                {
                    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${props.apiKey}&language=en-US&query=${searchParams.get("query")}&page=${searchParams.get("page") ? searchParams.get("page") : 1}&include_adult=false`)
                        .then(response => response.json())
                        .then(data =>
                        {
                            setSearchResults(data);
                        });
                    break;
                }
        }

    }, [searchParams.get("page"), searchParams.get("query")]);

    return <WatchObjList data={searchResults} />;
}

export default SearchList;