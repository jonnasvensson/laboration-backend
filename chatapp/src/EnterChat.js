import React from 'react';


export default function App({ handleChange, handleSubmit, userName }) {
    
    return (
        <form type="submit" onSubmit={handleSubmit}>
            <input
                className="input__name"
                placeholder="Name"
                type="text"
                onChange={handleChange}
                value={userName} />
            <input
                className="input__button"
                type="submit"
                value="Enter"
                onSubmit={handleSubmit} />
        </form>
    )
}