import React, { useState } from 'react';
import { Input, Button } from '@fluentui/react-components';

const NoteForm = ({ addNote }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(input);
    setInput(''); // Clear the input after adding
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button className="fluent-button" appearance="primary" type="submit">Add Note</Button>
    </form>
  );
};

export default NoteForm;
