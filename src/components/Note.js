import React from 'react';
import { 
    DeleteRegular, 
    DeleteFilled, 
    bundleIcon,
    iconFilledClassName,
    iconRegularClassName,
} from '@fluentui/react-icons';
import { makeStyles } from '@fluentui/react-components';

// Bundle the regular and filled versions of the Delete icon
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

// Define styles for the icon
const useIconStyles = makeStyles({
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: '1rem', // Set the icon size
    marginLeft: 'auto', // Pushes the icon to the right
    cursor: 'pointer', // Changes the cursor on hover
    ':hover': { // Changes the icon color on hover
      [`& .${iconFilledClassName}`]: {
        display: 'none',
      },
      [`& .${iconRegularClassName}`]: {
        display: 'inline',
      },
    },
  },
});

// TODO: Fix hover effect on the icon
// TODO: Wrap note content to prevent overflow
// TODO: Add card-like styling to the note
// TODO: Add local storage to persist notes etc.
// TODO: Add a confirmation dialog before deleting a note
// TODO: Rearrange the notes using drag and drop

const Note = ({ id, content, deleteNote }) => {
  const styles = useIconStyles();
  
  const iconStyleProps = {
    primaryFill: 'currentColor', // Use the text color for the icon
    className: styles.icon,
  };

  return (
    <div className={styles.iconContainer}>
      {content}
      <DeleteIcon {...iconStyleProps} onClick={() => deleteNote(id)} aria-label="Delete note" />
    </div>
  );
};

export default Note;
