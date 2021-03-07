import React from 'react';

export function ListUser(props) {
    return <tr> <td> {props.name} </td> <td> {props.score} </td> </tr>;
}
