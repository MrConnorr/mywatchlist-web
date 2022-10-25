import React from 'react';
import style from './css/WatchObjsListControls.module.css'
import {useParams} from "react-router-dom";
import Button from "./Button";

function WatchObjsListControls(props)
{
    const controls = props.controls;
    const {type} = useParams();

    const formattedType = type ? type.charAt(0).toUpperCase() + type.slice(1).replaceAll("_", " ")  : null;
    return (
        <div className={style.controls_container}>
            <div className={style.controls}>
                {controls.map((control, index) =>
                    <Button key={index} state={control === formattedType ? "primary" : "tertiary"} onClick={() => props.switchWatchObjects(control)}>{control}</Button>
                )}
            </div>
        </div>
    );
}

export default WatchObjsListControls;