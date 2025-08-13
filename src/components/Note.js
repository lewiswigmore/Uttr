import React, { useState } from 'react';
import {
  DeleteRegular,
  DeleteFilled,
  bundleIcon,
  iconFilledClassName,
  iconRegularClassName,
} from '@fluentui/react-icons';
import { Input, Button, makeStyles } from '@fluentui/react-components';

// Bundle the regular and filled versions of the Delete icon
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

// Define styles for the icon
const useIconStyles = makeStyles({
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  icon: {
    fontSize: '1rem', // Set the icon size
    cursor: 'pointer', // Changes the cursor on hover
    ':hover': {
      [`& .${iconFilledClassName}`]: {
        display: 'none',
      },
      [`& .${iconRegularClassName}`]: {
        display: 'inline',
      },
    },
  },
  editInput: {
    flexGrow: 1,
    marginRight: '0.5rem',
  },
});

// TODO: Fix hover effect on the icon
// TODO: Wrap note content to prevent overflow
// TODO: Add card-like styling to the note
// TODO: Add local storage to persist notes etc.
// TODO: Add a confirmation dialog before deleting a note
// TODO: Rearrange the notes using drag and drop

const Note = ({ id, content, deleteNote, updateNote }) => {
  const styles = useIconStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const iconStyleProps = {
    primaryFill: 'currentColor', // Use the text color for the icon
    className: styles.icon,
  };

  const handleSave = () => {
    updateNote(id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className={styles.iconContainer}>
      {isEditing ? (
        <Input
          className={styles.editInput}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <span>{content}</span>
      )}
      <div className={styles.actions}>
        {isEditing ? (
          <Button appearance="primary" size="small" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button
            appearance="secondary"
            size="small"
            onClick={() => {
              setIsEditing(true);
              setEditedContent(content);
            }}
          >
            Edit
          </Button>
        )}
        <DeleteIcon
          {...iconStyleProps}
          onClick={() => deleteNote(id)}
          aria-label="Delete note"
        />
      </div>
    </div>
  );
};

export default Note;
