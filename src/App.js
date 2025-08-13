import React, { useState } from 'react';
import NoteForm from './components/NoteForm';
import Note from './components/Note';
import Logo from './logo-text.svg';
import { Text } from '@fluentui/react-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

function App() {
  // State to store the list of notes
  const [notes, setNotes] = useState([]);

  // Function to add a new note
  const addNote = (newNoteContent) => {
    if (!newNoteContent) return; // Prevent adding empty notes
    const newNote = {
      id: Date.now(), // Simple unique ID for each note
      content: newNoteContent,
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedNotes = Array.from(notes);
    const [moved] = reorderedNotes.splice(source.index, 1);
    reorderedNotes.splice(destination.index, 0, moved);
    setNotes(reorderedNotes);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img src={Logo} alt="Uttr Logo" className="app-logo" />
        </div>
        <Text className="app-tagline" italic="true" weight="medium" size="large">A minimalist note-taking app.</Text>
      </header>
      <main className="app-main">
        <NoteForm addNote={addNote} />
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="notes">
            {(provided) => (
              <div
                className="notes-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {notes.map((note, index) => (
                  <Draggable
                    key={note.id}
                    draggableId={note.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >
                        <Note
                          id={note.id}
                          content={note.content}
                          deleteNote={deleteNote}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </div>
  );
}

export default App;
