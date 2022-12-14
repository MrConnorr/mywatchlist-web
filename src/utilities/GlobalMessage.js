import React, {useEffect, useRef, useState} from 'react';
import styles from './css/GlobalMessage.module.css';
import {Icons} from './Icons';

function GlobalMessage(props)
{
    const {message, setMessage, state, setState} = props;

    const ref = useRef();
    const ref2 = useRef();

    let timer = null;

    useEffect(() =>
    {
        ref2.current.classList.remove(styles.progress_bar_animation);

        setTimeout(() =>  ref2.current.classList.add(styles.progress_bar_animation), 100)

        if(timer !== null)
        {
            clearInterval(timer);
        }

        timer = setTimeout(() =>
        {
            emptyMessage();
        }, 7000);

        return () => clearInterval(timer);

    }, [message])

    const emptyMessage = () =>
    {
        ref.current.classList.add(styles.reverse_animation);

        setTimeout(() =>
        {
            setMessage("");
            setState("");
        }, 1000)
    }

    console.log(ref2);

    return (
        <div className={styles.message_container}>
            <div className={`${styles.message_content_container}`} ref={ref}>

                <div className={`${styles.state} + ${styles[state]}`} />

                <div className={styles.message_info_container}>
                    <div className={styles.state_icon} style={{color: state === "error" ? "#C6394A" : state === "warning" ? "#E6BD19" : "#1EA966"}}>{Icons[state === "error" ? "danger" : state]}</div>

                        <div className={styles.message_content}>
                            <div className={styles.message}>{message}</div>
                            <div onClick={emptyMessage} className={styles.close_container}>{Icons.close}</div>
                        </div>
                    </div>

                    <div className={styles.progressbar_container}>
                        <div className={styles.progressbar} ref={ref2} />
                    </div>
                </div>
        </div>
    );
}

export default GlobalMessage;