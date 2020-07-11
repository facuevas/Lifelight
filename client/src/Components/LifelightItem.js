import React from 'react';

const LifelightItem = props => {
    return(
        <div>
            <li>
                {props.lifelight.title}
            </li>
        </div>
    );
}

export default LifelightItem;