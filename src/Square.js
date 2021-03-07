import React from 'react';
import './Board.css';

export function RenderSquare(props) {
    return <div onClick={props.clickHandler} class="box">{props.letter}</div>
}