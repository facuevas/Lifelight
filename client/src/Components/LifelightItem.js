import React from 'react';

// TODO: FIX CSS

const LifelightItem = props => {
    console.log(props.props);
    return(
        <div>
            <h2>{props.props.title} {props.props.lifelight_type}</h2>
            <p>{props.props.description}</p>
            <p>Posted {props.props.createdAt}</p>
            <br></br>
        </div>
    );
}

export default LifelightItem;