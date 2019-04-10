import React from 'react';
import { List, ListItem, withStyles, createStyles, ListItemAvatar, Avatar, ListItemText, Typography } from '@material-ui/core';
import PaperSheet from '../../../../components/paper_sheet/paper_sheet';

const styles = theme => createStyles({
    root: {
      width: '100%',
    //   maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
});
interface PropTypes {
    classes: any;
    data: any[];
}
const SearchResultsWrapper = ({classes, data}: PropTypes) => {
    return (
        <div>
            {!data.length && (
                <PaperSheet>
                    <Typography variant="h5" component="h3">
                    No hay resultados!
                    </Typography>
                    <Typography component="p">
                    Prueba buscar con una fecha diferente.
                    </Typography> 
                </PaperSheet>
            )}
            {data.length > 0 && (<List className={classes.root}>
                {data.map((item, i) => (
                    <ListItem key={`item_${i}`} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="https://via.placeholder.com/50x50" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Destino a ${item.destination.name}`}
                            secondary={
                                <React.Fragment>
                                <Typography component="span" className={classes.inline} color="textPrimary">
                                    Salida desde {item.origin.name}
                                </Typography>
                                </React.Fragment>
                            }
                        />
                        <ListItemText
                            primary={`Hora`}
                            secondary={
                                <React.Fragment>
                                <Typography component="span" className={classes.inline} color="textPrimary">
                                    {item.time}
                                </Typography>
                                </React.Fragment>
                            }
                        />
                        <ListItemText
                            primary={`Precio`}
                            secondary={
                                <React.Fragment>
                                <Typography component="span" className={classes.inline} color="textPrimary">
                                S/{item.minPrice} - S/{item.maxPrice} 
                                </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))}
            </List>)}
        </div>
    );
}
const SearchResults = withStyles(styles)(SearchResultsWrapper);
export default SearchResults;