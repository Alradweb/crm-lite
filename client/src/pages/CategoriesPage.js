import React from 'react';
import {Link, withRouter} from "react-router-dom";
import {isMobile} from "react-device-detect";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import Loader from '../components/Loader';
import Category from "../components/Category";
import withCategories from "../hoc/withCategories";


const CategoriesPage = ({loading, categories, history}) => {

    const content = categories && categories.length ?
        <ul className="collection">
            {categories.map(({name, id}, index) => {
                return (
                    <Category
                        showAll={false}
                        key={id}
                        id={id}
                        index={index}
                        name={name}
                        onClickHandler={(id) => history.push(`/categories/${id}`)}
                    />
                )
            })}
        </ul> : <p>No categories</p>;
    const loader = loading ? <Loader/> : null;
    return (
        <>
        <Sidebar/>
        <main className={`content ${isMobile ? 'content-mobile' : ''}`}>
            <div className="page-title">
                <h4>Categories</h4>
                <Link to="/categories/new" className="waves-effect btn "
                      style={{backgroundColor: '#2bbbad', color: 'white'}}>Add
                    category
                </Link>
            </div>

            <div className="row">
                <div className="col s12">
                    {loader || content}
                </div>
            </div>
        </main>
        <FloatingButton/>
        </>
    )

};


export default withRouter(withCategories(CategoriesPage))
