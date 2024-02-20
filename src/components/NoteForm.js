import React, { useState } from 'react';
import { Input, Button, makeStyles } from '@fluentui/react-components';

const useNoteFormStyles = makeStyles({
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Distributes space between children
    width: '100%', // Full width to stretch in the container
    marginTop: '1rem', // Space between the form and the notes
    marginBottom: '1rem', // Space between the form and the notes
  },
  inputStyle: {
    flexGrow: 1, // Input grows to fill the space
    marginRight: '1rem', // Space between the input and the button
  },
});

// TODO: Add overflow handling to the input
// TODO: Add a placeholder to the input

const NoteForm = ({ addNote }) => {
  const [input, setInput] = useState('');
  const styles = useNoteFormStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(input);
    setInput(''); // Clear the input after adding
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <Input className={styles.inputStyle} value={input} onChange={(e) => setInput(e.target.value)} />
      <Button appearance="primary" type="submit">Add Note</Button>
    </form>
  );
};

export default NoteForm;
