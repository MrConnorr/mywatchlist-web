import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import Person from "./Person";
import Comments from "./watchObjComp/comments/Comments";
import WatchObj from "../../utilities/WatchObj";

function WatchObjSwitcher(props)
{
    const {apiKey, setMessage, setState} = props;
    const {mediaType} = useParams();
    const {watchObjId} = useParams();

    const [isWatchObjFound, setIsWatchObjFound] = useState(false);

    const RenderSwitch = () =>
    {
        switch (mediaType)
        {
            case "movie":
                return <WatchObj apiKey={apiKey} setMessage={setMessage} setState={setState} isWatchObjFound={isWatchObjFound} setIsWatchObjFound={setIsWatchObjFound} />
            case "series":
                return <WatchObj apiKey={apiKey} setMessage={setMessage} setState={setState} isWatchObjFound={isWatchObjFound} setIsWatchObjFound={setIsWatchObjFound} />
            case "person":
                return <Person apiKey={apiKey} isWatchObjFound={isWatchObjFound} setIsWatchObjFound={setIsWatchObjFound} />
        }
    }

    return (
        <>
            {RenderSwitch()}
            {isWatchObjFound && <Comments watchObjId={watchObjId} mediaType={mediaType} setMessage={setMessage} setState={setState} />}
        </>
    );
}

export default WatchObjSwitcher;