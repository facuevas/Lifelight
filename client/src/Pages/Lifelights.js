import React, { useState, useEffect } from 'react';
import LifelightItem from '../Components/LifelightItem';
import LifelightService from '../Services/LifelightService';

const Lifelights = props => {
    //const [lifelight, setLifelight] = useState({lifelight_type: "", title: "", description: "", created_by: ""}); -> might be used to create lifelights. debating on whether allow user to add lifelights here or on another page
    // Right now, let's just get the lifelights to display
    const [lifelights, setLifelights] = useState([]);

    useEffect(() => {
        LifelightService.getLifelights().then(data => {
            setLifelights(data.lifelights);
        })
    }, []);

    return(
        <div>
            <h3>My Lifelights</h3>
            <br></br>
                {
                    lifelights.map((lifelight, index) => {
                       return <LifelightItem props={lifelight} key={lifelight._id} />
                    })
                }
        </div>
    );
}

export default Lifelights;