import React, {useEffect, useState} from 'react';
import styles from './css/Preloader.module.css';
import PulseLoader from "react-spinners/PulseLoader";
import Button from "./Button";

function Preloader(props)
{
    const [displayStyle, setDisplayStyle] = useState("flex");

    useEffect(() =>
    {
        if(!props.loading)
        {
            setTimeout(() => setDisplayStyle("none"),200)
        }

    }, [props.loading]);

    return (
        <div className={styles.preloader_container} style={{display: displayStyle, opacity: props.loading ? 1 : 0}}>
            <PulseLoader
                color="#7f5af0"
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default Preloader;