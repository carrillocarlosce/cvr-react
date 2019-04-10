import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, Paper, Theme, createStyles, withStyles, IconButton, List, ListItem, Avatar, ListItemText, ListSubheader, LinearProgress } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

import { firestore } from '../../../../services/firebase';
import Browser from '../../../../components/browser/browser';

const HomeWrapper = styled.div`
    display: flex;
    flexGrow: 1;
    flex-direction: column;
`;
const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        padding: 0,
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative'
    },
    
    progress: {
        // position: 'absolute',
        // width: '100%',
        // zIndex: 1,
    },
    
});
const Home = (props) => {
    const { classes, location, user } = props;
    
    return (
        <HomeWrapper>
            <Browser userId={user.uid}/>
             
        </HomeWrapper>
    )}

export default withStyles(styles)(Home)