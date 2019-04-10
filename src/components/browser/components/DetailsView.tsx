import React, { useState, useEffect } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import filesize from 'filesize';
import red from '@material-ui/core/colors/red';
import ContextualMenu from '../../Popper/ContextualMenu';
import moment from 'moment';
import 'moment/locale/es'
import { List, ListItem, ListItemText, Button, Theme } from '@material-ui/core';
import firebaseApp from '../../../services/firebase';


moment.locale('es')
interface PropTypes {
    classes: any,
    selected: any | null,
    close?(): void
}
const styles = (theme: Theme) => createStyles({
  card: {
    // [theme.breakpoints.down(960)]: {
      width: '400px',
    // },
    [theme.breakpoints.down(600)]: {
      width: '70vw',
    },
    [theme.breakpoints.down(376)]: {
      width: '90vw',
    },

  },
  media: {
    height: 0,
    // paddingTop: '56.25%', // 16:9
    paddingTop: '30%', // 16:9
  },
  actions: {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

const DetailsView = (props: PropTypes) => {

    const { classes, selected, close } = props;
    const [preview, setPreview] = useState('');
    const [view, setView] = useState('');
    const [download, setDownload] = useState(null);
    useEffect(() => {
      firebaseApp.storage().ref(selected.filePath).getDownloadURL()
        .then(url => {
          console.log(url)
          setView(url)
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
            var blob = xhr.response;
            const blobURL = URL.createObjectURL(blob)
            setDownload(blobURL)
          };
          xhr.open('GET', url);
          xhr.send();
          if(selected.contentType.split('/')[0] === 'image'){
            setPreview(url)
          }
        })
        .catch(error => {
          console.log(error)
        })
      
    },[])
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" src={selected.uploader.photoURL} className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <ContextualMenu items={[
                {
                    name: 'Eliminar',
                    action: () => {
                        selected.delete()
                        close()
                    }
                }
            ]}/>
          }
          title={selected.uploader.name}
          subheader={moment().to(selected.updatedAt.toDate())}
        />
        {!!preview &&
          <CardMedia
          className={classes.media}
          image={preview}
          title={selected.name}
        />
        }
        <CardContent style={{padding: 0}}>
          <List dense={true}>
            <ListItem>
              <ListItemText
                primary="Nombre del archivo"
                secondary={selected.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Tamaño"
                secondary={filesize(selected.size)}
              />
            </ListItem>
          </List>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
        <Button
            component={'a'}
            disabled={!(!!view)}
            href={view}
            target="_blank"
            color="primary">
            Ver
          </Button>
          <Button
            component={'a'}
            disabled={!(!!download)}
            href={download}
            download={selected.name}
            color="secondary">
            Descargar
          </Button>
        </CardActions>
        
      </Card>
    );
}



export default React.memo(withStyles(styles)(DetailsView));