import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { FaFileImage, FaFolder, FaFileCode, FaFileArchive, FaFile, FaFilePdf } from 'react-icons/fa';

interface PropTypes {
    contentType: string
}
// const styles = theme => createStyles({
//   root: {},
// });
const switchIcon = (contentType) => {
  const type = contentType.split('/');
  switch (type[0]) {
    case 'image':
      switch (type[1]) {
        default:
          return <FaFileImage />;  
      }
    case 'text':
      return <FaFileCode />;
    case 'application':
      switch (type[1]) {
        case 'pdf':
          return <FaFilePdf />
        default:
          return <FaFile />;  
      }
    default:
      return <FaFolder />;
  }
} 
// {...iconProps}
const IconFileTypeWrapper =(props: PropTypes) => {
  const { contentType, ...iconProps } = props;
  return switchIcon(contentType)
}


const IconFileType = IconFileTypeWrapper;
export default IconFileType;