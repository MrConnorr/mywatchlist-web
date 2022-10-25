import React from 'react';
import styles from '../css/Footer.module.css';

function Footer(props)
{
    return (
        <div className={styles.footer_container}>
            <span>
                MyWatchList uses <a href="https://developers.themoviedb.org/3/getting-started/introduction" target="_blank"> <img alt="The Movie DB Logo" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" /></a>
            </span>

            <span>Created by<a href="https://konstantinovroman.com" target="_blank">Roman Konstantinov</a></span>

            © 2022 MyWatchList. All rights reserved.
        </div>
    );
}

export default Footer;