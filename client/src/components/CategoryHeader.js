import React from 'react';
import {Link} from "react-router-dom";

const CategoryHeader = ({id, isNewCategory, deleteCategory}) => {
    return (
        <div className="page-title">
            <h4>
                <Link to="/categories">Categories</Link>
                <i className="material-icons">keyboard_arrow_right</i>
                {isNewCategory ? 'Add' : 'Edit'} category
            </h4>
            <span className={isNewCategory ? 'btn-hidden' : ''}>
                <button onClick={() => deleteCategory(id)}
                        disabled={id === null}
                        className="btn btn-small red ">
                    <i className="material-icons">delete</i>
                </button>
            </span>
        </div>
    )
};

export default CategoryHeader;