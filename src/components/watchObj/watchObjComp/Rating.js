import React, {useEffect, useState} from 'react';
import ReactStars from "react-rating-stars-component";
import {Icons} from "../../../utilities/Icons";

import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

function Rating(props)
{
    const {mediaType, watchObjId, isMWL, otherRating, showNR} = props;
    const [userRating, setUserRating] = useState(null);
    const [starKeyForce, setStarKeyForce] = useState(0);

    const isNRVisible = showNR !== undefined ? showNR : true;


    useEffect(() =>
    {
        if(mediaType !== "person" && isMWL)
        {
            fetch(`${process.env.API_LINK}/rating/${mediaType === "movie" ? mediaType : "series"}/${watchObjId}`)
                .then(response => response.json())
                .then(data =>
                {
                    if(data.error) throw new Error(data.error);

                    setUserRating(data.rating);
                })
                .catch(err =>
                {
                    /*                setMessage(err.message);
                                    setState("error")*/

                    console.log(err.message);
                })
        }
    }, [watchObjId]);

    useEffect(() =>
    {
        setStarKeyForce(prev => prev + 1)
    }, [userRating]);

    return(
      <>
          {isMWL &&
              <div style={{display: "flex", alignItems: "center", fontSize: "20px", gap: "5px"}}>
                  <ReactStars
                      count={5}
                      size={24}
                      value={userRating}
                      isHalf={true}
                      edit={false}
                      emptyIcon={Icons.star}
                      halfIcon={Icons.halfStar}
                      filledIcon={Icons.star}
                      key={starKeyForce} /> {isNRVisible ? userRating !== 0  ? userRating : "NR" : null}
              </div>
          }

          {!isMWL &&
              <CircularProgressbar styles={buildStyles({
                  pathColor: otherRating <=39 ? "#C6394A" : otherRating <=69 ? "#E6BD19" : "#1EA966",
                  trailColor: 'rgba(255, 255, 255, 0.25)',
                  backgroundColor: '#16161AFF',
                  textSize: '28px',
                  textColor: '#7f5af0'
                  })} value={otherRating} text={otherRating === 0 ? "NR" : `${otherRating}%`} background={true}/>
          }
      </>
    );
}

export default Rating;