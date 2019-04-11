import React from 'react';
import no_photo from '../images/nophoto.jpg';

const Category = ({id, name, index, onClickHandler, imageSrc, showAll}) => {
    const animateClick = () =>{
        setTimeout(() => onClickHandler(id), 300)
    };
    return showAll ? (
        <li className="card waves-effect pointer item-hover" onClick={animateClick}>
            <div className="center">
                <img alt="no" src={imageSrc || no_photo} className="responsive-img order-img"/>
            </div>
            <div className="card-content center p10">
                <h5 className="m0">{name}</h5>
            </div>
        </li>
    ) : (
        <li className=" collection-item item-hover waves-effect dli" onClick={animateClick}>
            <span>Category № {index + 1}</span>
            <span> {name}</span>
        </li>
    )

};
export default Category
