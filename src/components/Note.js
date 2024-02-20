import React from 'react';
import { Button } from '@fluentui/react-components';

const Note = ({ id, content, deleteNote }) => {
  return (
    <div>
      {content}
      <Button className="fluent-button" onClick={() => deleteNote(id)}>Delete Note</Button>
    </div>
  );
};

export default Note;
