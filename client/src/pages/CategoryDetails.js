import React from 'react';
import {withRouter} from "react-router-dom";
import {MContext} from '../services/m_service';
import HttpService from "../services/httpservice";
import {connect} from "react-redux";
import {isMobile} from "react-device-detect";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import CategoriesForm from "../components/CategoriesForm";
import PositionsForm from "../components/PositionsForm";
import CategoryHeader from "../components/CategoryHeader";

const {getCategory, createOrUpdateCategory, removeCategory} = new HttpService();

class CategoryDetails extends React.Component {
    state = {
        category: {
            id: null,
            name: '',
            image: null,
            imagePreview: '',
            touched: false
        },
        positions: []
    };
    controller = new AbortController();
    signal = this.controller.signal;

    receivePositions = (newPositions) => {
        this.setState({positions: newPositions})
    };
    processReceivedData = (data) =>{
        const baseUrl = typeof window.location.origin === 'undefined' ?
            `${window.location.protocol}//${window.location.host}` :
            window.location.origin;
        if (data.ok) {
            this.setState(({category}) => {
                const newCategory = {
                    ...category,
                    name: data.name,
                    id: data.id,
                    imagePreview: data.imageSrc ? `${baseUrl}/${data.imageSrc}` : ''
                };
                return {category: newCategory}
            })
        } else {
            if (data.message) {
                if(data.message.includes('aborted')) return;
                this.context.showMessage(data.message);
                this.setState({loading: false});
            }
        }
    };
    updateState = () => {
        const {id} = this.props;
        if (id !== 'new') {
            getCategory(id, this.signal)
                .then(data => {
                   this.processReceivedData(data)
                })
        } else {
            this.setState(({category}) => {
                const newCategory = {...category, id: this.props.id};
                return {category: newCategory}
            })
        }
    };

    componentDidMount() {
        this.updateState();
    };

    componentDidUpdate() {
        this.context.updateTextFields();
    };

    componentWillUnmount() {
        this.context.Toast.dismissAll();
        this.controller.abort();
    };

    deleteCategory = (id) => {
        const confirmation = window.confirm(`Are you sure you want to delete the category ${this.state.category.name}?`);
        if (!confirmation) return;
        if (this.props.guest) {
            this.context.showMessage('Access is denied. Register or login.');
            return;
        }
        removeCategory(id)
            .then(data => {
                this.context.showMessage(data.message);
                this.props.history.push(`/categories/new`);
            });
        this.setState({
            category: {
                id: 'new',
                name: '',
                image: null,
                imagePreview: '',
                touched: false
            },
            positions: []
        });
    };
    changeName = (name) => {
        this.setState(({category}) => {
            const newCategory = {...category, name, touched: true};
            return {category: newCategory}
        })
    };
    onFileUpload = (image) => {
        this.setState(({category}) => {
            const newCategory = {...category, image};
            return {category: newCategory}
        });
        const reader = new FileReader();
        reader.onload = () => {
            const imagePreview = reader.result;
            this.setState(({category}) => {
                const newCategory = {...category, imagePreview};
                return {category: newCategory}
            });
        };
        reader.readAsDataURL(image)
    };

    saveCategory = (id) => {
        const {name, image} = this.state.category;
        const categoryId = id === 'new' ? '' : `/${id}`;
        if (this.props.guest) {
            this.context.showMessage('Access is denied. Register or login.');
            return;
        }
        createOrUpdateCategory(name, image, categoryId)
            .then(data => {
                this.context.showMessage(data.message);
                this.props.history.push(`/categories/${data._id}`);
                this.updateState();
            })

    };

    render() {
        const {deleteCategory, changeName, onFileUpload, saveCategory, receivePositions} = this;
        const {category: {id, name, touched, imagePreview}, positions} = this.state;
        return (
            <>
            <Sidebar/>
            <main className={`content ${isMobile ? 'content-mobile' : ''}`}>
                <CategoryHeader isNewCategory={id === 'new'}
                                id={id}
                                deleteCategory={deleteCategory}
                />
                <CategoriesForm id={id}
                                name={name}
                                changeName={changeName}
                                onFileUpload={onFileUpload}
                                incorrect={touched && name.length < 3}
                                imagePreview={imagePreview}
                                saveCategory={saveCategory}
                />
                <PositionsForm id={id}
                               receivePositions={receivePositions}
                               positions={positions}
                />
            </main>
            {isMobile ? null : <FloatingButton/>}
            </>

        )
    }
}

CategoryDetails.contextType = MContext;

const mapStateToProps = ({auth}) => {
    return {
        guest: auth.guest
    }
};

export default withRouter(connect(mapStateToProps)(CategoryDetails))
