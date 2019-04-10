import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ThemeContext from '../../../../context/theme_context';
import MediaCard from './components/media_card';
import { firestore } from '../../../../services/firebase';
import {collection} from 'rxfire/firestore'
import { map } from 'rxjs/operators';
import { getPlaces } from '../../../home/api/places';
import { Grid, Paper } from '@material-ui/core';
const DestinationsWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const DestinationsHome = () => {
    const [destinations, setDestinations] = useState([]);
    

    useEffect(() => {
        getPlaces()
        .then(places => setDestinations(places))
        .catch(error => console.log(error))
    }, [destinations.length])
    return (
        <div>
            <Grid container spacing={24}>
                {destinations.map((item, i) => (
                    <Grid key={item.id} item lg={4} md={6} xs={12}>
                        <MediaCard
                            image={item.image}
                            title={item.name}
                            description={item.description}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
            // <DestinationsWrapper>
            //     <h1>Destinations</h1>
                
            // </DestinationsWrapper>
    )}

export default DestinationsHome