import React from 'react';

export function Board(props) {
    return props.board.map((letter, index) => <div class="box" onClick={() => props.onClick(index)}>{letter}</div>);
}