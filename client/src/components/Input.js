import React from 'react';

const Input = React.forwardRef((props, ref) =>{
    const{name, value, incorrect, onChange} = props;
    const errorMessage = incorrect  ? <span className="helper-text red-text">{`Enter the correct ${name}`}</span> : null;

    return (
        <div className="input-field">
            <input onChange={onChange}
                   ref={ref}
                   value={value}
                   id={name}
                   type={ name || 'text'}
                   name={name}
                   required
                   className={incorrect ? "invalid" : ''}
            />
            <label htmlFor={name}>{name}</label>
            {errorMessage}
        </div>
    )
});
export default Input

