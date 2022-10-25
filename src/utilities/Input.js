import React from 'react';
import styles from './css/Input.module.css';

function Input(props)
{
    const {type, placeholder, minLength, maxLength, onChange, name, value, disabled, fontSize, width, height} = props;

    return <input type={type}
                  className={styles.input}
                  placeholder={placeholder}
                  minLength={minLength}
                  maxLength={maxLength}
                  onChange={onChange}
                  name={name}
                  value={value}
                  disabled={disabled}
                  style={{fontSize: `${fontSize}`, width: `${width}`, height: `${height}`}} />;
}

export default Input;