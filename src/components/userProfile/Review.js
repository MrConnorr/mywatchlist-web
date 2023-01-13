import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import Button from "../../utilities/Button";

function Review(props)
{
    const {watchObjId, review, score, watchStatus, setUserWatchlist,
        setMessage, isReviewClicked, setIsReviewClicked, isCheckDisabled, setIsCheckDisabled, setState} = props;

    const [icon, setIcon] = useState("edit");
    const [title, setTitle] = useState("Edit review");

    const handleReviewSubmit = () =>
    {
        setIsReviewClicked(current => !current);

        if(!isCheckDisabled)
        {
            let apiWatchStatus;

            switch (watchStatus)
            {
                case "statusDropped":
                    apiWatchStatus = "Dropped";
                    break;
                case "statusPlanToWatch":
                    apiWatchStatus = "Plan to watch";
                    break;
                case "statusPostponed":
                    apiWatchStatus = "Postponed";
                    break;
                case "statusWatching":
                    apiWatchStatus = "Currently watching";
                    break;
                case "statusCompleted":
                    apiWatchStatus = "Completed";
                    break;
            }


            fetch(`${process.env.API_LINK}/user/review/${watchObjId}`,
                {
                    method: "PATCH",
                    headers: {'Authorization': `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json'},
                    body: JSON.stringify(
                        {
                            "review": review,
                            "score": score,
                            "watchStatus": apiWatchStatus
                        })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);

                    setUserWatchlist(data.watchlistArr);
                    setIsReviewClicked(false);

                    setIsCheckDisabled(true);
                })
                .catch(err => {
                    setMessage(err.message);
                    setState("error");
                })
        }
    }

    useEffect(() =>
    {
        if (isReviewClicked)
        {
            setIcon("check");
            setTitle("Confirm editing");

        } else
        {
            setIcon("edit")
            setTitle("Edit review");
        }
    }, [isReviewClicked]);

    return (
        <>
            <Button icon={icon} state={isReviewClicked && isCheckDisabled ? "disabled" : "tertiary"} title={title} onClick={() => handleReviewSubmit()} />

            {isReviewClicked &&
                <Button icon="cancelEdit" state="tertiary" title="Cancel changes" onClick={() =>
                {
                    setIsReviewClicked(current => !current);
                    setIsCheckDisabled(true);
                }} />
            }
        </>
    )
}

export default Review;