import React, { useEffect } from 'react';
import LifelightService from '../Services/LifelightService';


// TODO: FIX CSS

const LifelightItem = props => {

    useEffect(() => {
        LifelightItem.getUsername()
    }, []);

    console.log(props.props);
    return(
        <div>
            <h2>{props.props.title} {props.props.lifelight_type}</h2>
            <p>{props.props.description}</p>
            <p>Created by {props.props.created_by}</p>
            <p>Posted {props.props.createdAt}</p>
            <br></br>
        </div>
    );
}

export default LifelightItem;