import React from 'react';
import styles from './css/Button.module.css';
import {Icons} from './Icons';

function Button(props)
{
    const {width, height, justifyContent, padding, fontSize, target, title} = props;

    const state = !props.state ? "primary" : props.state;
    const href = props.state === "disabled" ? null : props.href;
    const onClick = props.state === "disabled" ? null : props.onClick;
    const iconPosition = props.iconPosition ? props.iconPosition : "left";

    return (
        <a href={href} onClick={onClick} target={target} className={`${styles[state]}`} title={title} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} style={{width: `${width}`,height: `${height}`, justifyContent: `${justifyContent}`, fontSize: `${fontSize}`, padding: `${padding}`}}>
            {iconPosition === "left" &&
                <div className={styles.icon} style={{display: props.icon ? "flex" : "none"}}>{Icons[props.icon]}</div>
            }
            <div style={{display: props.children ? "flex" : "none"}} id="btnText">{props.children}</div>
            {iconPosition === "right" &&
                <div className={styles.icon} style={{display: props.icon ? "flex" : "none"}}>{Icons[props.icon]}</div>
            }
        </a>
    );
}

export default Button;