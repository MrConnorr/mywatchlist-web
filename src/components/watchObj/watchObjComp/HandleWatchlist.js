import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import Button from "../../../utilities/Button";
import {useNavigate} from "react-router-dom";

function HandleWatchlist(props)
{
    const {setMessage, setState, watchObj, watchObjId} = props;

    const navigate = useNavigate();

    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [buttonText, setButtonText] = useState("");
    const [watchlistArrObjId, setWatchlistArrObjId] = useState(null);

    useEffect(() =>
    {
        if(Cookies.get('token'))
        {
            fetch(`https://mywatchlist-apiv2.herokuapp.com/user/watchlist/${watchObjId}`,
                {
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`}
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);

                    setIsInWatchlist(data.exists);
                    setWatchlistArrObjId(data.id);
                })
                .catch(err =>
                {
                    setMessage(err.message)
                    setState("error");
                })
        }
    }, [watchObjId])

    useEffect(() =>
    {
        setButtonText(isInWatchlist ? "Remove from list" : "Add to list")
    }, [isInWatchlist]);

    const handleWatchlistClick = () =>
    {
        if(!Cookies.get('token')) return navigate(`/auth/login`);

        if(!isInWatchlist)
        {
            fetch("https://mywatchlist-apiv2.herokuapp.com/user/watchlist/",
                {
                    method: "POST",
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                    body: JSON.stringify(
                        {
                            "watchObject": watchObj
                        })
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);

                    setMessage(data.message);
                    setState("success");
                    setButtonText("Remove from list");
                    setWatchlistArrObjId(data.id);
                })
                .catch(err =>
                {
                    setMessage(err.message)
                    setState("error");
                })
        } else
        {
            fetch(`https://mywatchlist-apiv2.herokuapp.com/user/watchlist/${watchlistArrObjId}`,
                {
                    method: "DELETE",
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);

                    setMessage(data.message);
                    setState("success");
                    setButtonText("Add to list");
                    setWatchlistArrObjId(null);
                })
                .catch(err =>
                {
                    setMessage(err.message)
                    setState("error");
                })
        }

        return setIsInWatchlist(current => !current);
    }

    return <Button width="7vw" onClick={handleWatchlistClick}>{buttonText}</Button>;
}

export default HandleWatchlist;