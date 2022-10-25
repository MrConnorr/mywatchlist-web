import React, {useEffect, useState} from 'react';
import styles from '../../css/Authorization.module.css'
import {useParams} from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import {Helmet} from "react-helmet-async";

function Authorization(props)
{
    const {setMessage, setState, apiKey, redirectOnToken, setIsLoggedIn} = props;

    const {option} = useParams();

    const [watchObjImgs, setWatchObjImgs] = useState([]);

    redirectOnToken();

    const [page, setPage] = useState(1);


    useEffect(() =>
    {
        fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                setWatchObjImgs([].concat.apply([], [...watchObjImgs, data.results.map(result => result.backdrop_path)]));
            })
            .finally(() => setPage(2));
    }, [page]);

    const renderSwitch = () =>
    {
        switch (option)
        {
            case "login":
                return <Login setMessage={setMessage} setState={setState} setIsLoggedIn={setIsLoggedIn} />
            case "signup":
                return <SignUp setMessage={setMessage} setState={setState} />
        }
    }

    return (
        <div className={styles.authorization_main_container}>
            <Helmet>
                <title>{option !== undefined ? option === "signup" ? "Sign Up | My Watch List" : "Login | My Watch List" : ""}</title>
            </Helmet>
            <div className={styles.posters_background}>
                {watchObjImgs.map((img, index) =>
                    <div className={styles.img_container} key={index}>
                     <img src={`https://image.tmdb.org/t/p/original${img}`} alt={""}/>
                    </div>
                )}
            </div>

            <div className={styles.auth_container}>
                <div className={styles.auth_content}>
                    {renderSwitch()}
                </div>
            </div>
        </div>
    );
}

export default Authorization;