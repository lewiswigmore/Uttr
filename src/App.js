import React, { useState } from 'react';
import NoteForm from './components/NoteForm';
import Note from './components/Note';
import Logo from './logo-text.svg';
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

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={Logo} alt="Uttr Logo" className="app-logo" />
      </header>
      <main className="app-main">
        <NoteForm addNote={addNote} />
        <div className="notes-list">
          {notes.map((note) => (
            <Note key={note.id} id={note.id} content={note.content} deleteNote={deleteNote} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
