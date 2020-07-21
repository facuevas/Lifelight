import React, { useState, useEffect } from 'react';
import LifelightItem from '../Components/LifelightItem';
import FeedService from '../Services/FeedService';

const Feed = props => {
    
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        FeedService.displayFeed().then(data => {
            setFeed(data.feed);
        });
    }, []);

    return(
        <div>
            <h3>My Feed</h3>
            {
                feed.map((fd, index) => {
                    return <LifelightItem props={fd} key={fd._id} />
                })
            }
        </div>
    );
};

export default Feed;