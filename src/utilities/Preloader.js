import React from 'react';
import styles from './css/Preloader.module.css';
import PulseLoader from "react-spinners/PulseLoader";

function Preloader(props)
{
    return (
        <div className={styles.preloader_container} style={{display: props.loading ? "flex" : "none"}}>
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