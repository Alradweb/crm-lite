import React from 'react';
import no_photo from  '../images/nophoto.jpg'


const CategoriesForm = ({id, name, changeName, incorrect, onFileUpload, imagePreview, saveCategory}) => {
    const imgInput = React.createRef();
    const onSubmitHandler = ev => ev.preventDefault();
    const isDisabled =  id === null;
    const errorMessage = incorrect  ? <span className="helper-text red-text">{`Enter the correct name`}</span> : null;
        return (
            <>
            <form onSubmit={onSubmitHandler} className="row">
                <div className="col s12 l6 mb-form">
                    <div className="input-field">
                        <input className={incorrect ? "invalid" : ''}
                               value={name}
                               onChange={(ev) => changeName(ev.target.value)}
                               id="name"
                               type="text"
                               disabled={isDisabled}
                               required/>
                        <label htmlFor="name">Name</label>
                        {errorMessage}
                    </div>
                    <div>
                        <input ref={imgInput}
                               onChange={(ev) => onFileUpload(ev.target.files[0])}
                               type="file"
                               hidden/>
                        <button onClick={()=> imgInput.current.click()}
                                disabled={isDisabled}
                                className="waves-effect waves-light btn orange lighten-2 mb2" type="button">
                            <i className="material-icons left">backup</i>
                            Upload image
                        </button>
                    </div>

                    <div>
                        <button onClick={() => saveCategory(id)}
                            className="waves-effect waves-light btn" disabled={name.length < 3}>
                            Save changes
                        </button>
                    </div>
                </div>
                <div className="col s12 l4 center">
                    <img className="responsive-img" style={{height: '180px'}} src={imagePreview || no_photo} alt="product"/>
                </div>
            </form>
            </>
       )

};
export default CategoriesForm

