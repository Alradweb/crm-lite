import React from 'react';
import {CURRENCY} from "../constants";

const Position = ({positionId, name, cost, index, selectedPosition, onDeletePosition}) => {

    const deletePosition = ev =>{
        ev.stopPropagation() ;
        onDeletePosition(positionId, name);
    };
    return (
        <li onClick={() => selectedPosition(index)} className="collection">
            <p className="collection-item collection-item-icon not-gloomy">
                <span>
                    {name} <strong>  {cost} {CURRENCY}</strong>
                </span>
                <span>
                    <i onClick={deletePosition} className="material-icons ">delete</i>
                </span>
            </p>
        </li>
    )
};

export default Position