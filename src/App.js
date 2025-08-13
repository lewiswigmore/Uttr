import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Text,
  Button,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import {
  WeatherMoonRegular,
  WeatherSunnyRegular,
  DocumentTextRegular
} from '@fluentui/react-icons';

import NoteForm from './components/NoteForm';
import Note from './components/Note';
import SearchAndFilter from './components/SearchAndFilter';
import EmptyState from './components/EmptyState';
import Logo from './logo-text.svg';
import { useLocalStorage } from './hooks/useLocalStorage';
import { searchNotes, getAllTags } from './utils/noteUtils';
import { buildLinkGraph } from './utils/linking';
import { loadDemoData } from './utils/demoData';
import LinkGraph from './components/LinkGraph';
import './App.css';

const useStyles = makeStyles({
  appContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 768px)': {
      padding: '24px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '48px',
    paddingBottom: '24px',
    '@media (max-width: 768px)': {
      marginBottom: '32px',
      paddingBottom: '16px',
    },
    '@media (max-width: 480px)': {
      marginBottom: '24px',
      paddingBottom: '12px',
    },
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    height: '48px',
    width: 'auto',
    maxWidth: '200px',
    '@media (max-width: 480px)': {
      height: '36px',
      maxWidth: '150px',
    },
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 480px)': {
      gap: '12px',
    },
  },
  statsText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase100,
    },
  },
  themeToggle: {
    minWidth: 'auto',
    padding: '8px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  notesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '16px',
    },
  },
  sectionHeader: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 4px',
  },
  layoutRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '32px',
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  sidePanel: {
    width: '340px',
    position: 'sticky',
    top: '32px',
    maxHeight: 'calc(100vh - 64px)',
    overflow: 'auto',
    paddingRight: '4px',
  },
  '@media (max-width: 1200px)': {
    layoutRow: {
      flexDirection: 'column',
    },
    sidePanel: {
      width: '100%',
      position: 'static',
      maxHeight: 'none'
    }
  }
});

function App() {
  const styles = useStyles();
  const [notes, setNotes] = useLocalStorage('uttr-notes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('updated');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('uttr-dark-mode', false);
  const [showGraph, setShowGraph] = useLocalStorage('uttr-show-graph', true);
  const [noteLayout, setNoteLayout] = useLocalStorage('uttr-note-layout', 'grid'); // 'grid' | 'masonry'
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [highlightedNoteId, setHighlightedNoteId] = useState(null);
  const noteRefs = useRef({});
  const noteFormRef = useRef(null);

  // Apply dark mode to body
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // Get all available tags
  const availableTags = useMemo(() => getAllTags(notes), [notes]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = searchNotes(notes, searchTerm);

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.some(tag =>
          note.tags?.some(noteTag => 
            noteTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Sort notes
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'pinned':
          if (a.isPinned !== b.isPinned) {
            return b.isPinned ? 1 : -1;
          }
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'created-desc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'content-length':
          return (b.content || '').length - (a.content || '').length;
        case 'content-length-desc':
          return (a.content || '').length - (b.content || '').length;
        case 'updated-desc':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'updated':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return sorted;
  }, [notes, searchTerm, selectedTags, sortBy]);

  // Build link graph (memoized)
  const linkGraph = useMemo(() => buildLinkGraph(notes), [notes]);

  const registerNoteRef = useCallback((id, el) => {
    if (el) noteRefs.current[id] = el;
  }, []);

  const navigateToNote = useCallback((id) => {
    if (!id) return;
    setActiveNoteId(id);
    setHighlightedNoteId(id);
    const el = noteRefs.current[id];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // remove highlight after delay
    setTimeout(() => {
      setHighlightedNoteId(prev => (prev === id ? null : prev));
    }, 2500);
  }, []);

  // Note management functions
  const addNote = (newNote) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const updateNote = (id, updatedNote) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? updatedNote : note
      )
    );
  };

  const togglePin = (id) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  // Filter functions
  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const handleCreateFirstNote = () => {
    if (noteFormRef.current) {
      noteFormRef.current.focus();
    }
  };

  const clearDemoData = useCallback(() => {
    if (window.confirm('This will remove ALL current notes and reload. Continue?')) {
      localStorage.removeItem('uttr-notes');
      window.location.reload();
    }
  }, []);

  const injectDemoData = useCallback(() => {
    if (window.confirm('Overwrite current notes with demo workspace?')) {
      loadDemoData();
    }
  }, []);

  const pinnedNotes = filteredAndSortedNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredAndSortedNotes.filter(note => !note.isPinned);
  const totalNotes = notes.length;
  const hasSearchOrFilter = searchTerm || selectedTags.length > 0;

  const layoutClasses = {
    grid: styles.notesGrid,
    masonry: `${styles.notesGrid} masonry` // will override via global CSS
  };

  const cycleLayout = () => {
    setNoteLayout(prev => prev === 'grid' ? 'masonry' : 'grid');
  };

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <div className={styles.appContainer}>
        <header className={styles.header}>
          <div className={styles.logoSection}>
            <img src={Logo} alt="Uttr - Capture thoughts, organize ideas" className={styles.logo} />
          </div>
          
          <div className={styles.headerActions}>
            <Text className={styles.statsText}>
              <DocumentTextRegular />
              {totalNotes} note{totalNotes !== 1 ? 's' : ''}
            </Text>
            {totalNotes > 0 && (
              <Button appearance="subtle" onClick={injectDemoData} size="small">Load Demo</Button>
            )}
            {totalNotes > 0 && (
              <Button appearance="subtle" onClick={clearDemoData} size="small">Clear Notes</Button>
            )}
            <Button
              className={styles.themeToggle}
              appearance="subtle"
              icon={isDarkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            />
            {totalNotes > 0 && (
              <Button appearance="subtle" size="small" onClick={cycleLayout}>
                {noteLayout === 'grid' ? 'Masonry' : 'Grid'} View
              </Button>
            )}
            {totalNotes > 0 && (
              <Button appearance="subtle" size="small" onClick={() => setShowGraph(g => !g)}>
                {showGraph ? 'Hide Graph' : 'Show Graph'}
              </Button>
            )}
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.layoutRow}>
            <div className={styles.mainColumn}>
              <NoteForm addNote={addNote} />

              {notes.length > 0 && (
                <SearchAndFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                  onClearFilters={clearFilters}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              )}

              {filteredAndSortedNotes.length === 0 ? (
                <EmptyState
                  type={hasSearchOrFilter ? 'search' : 'notes'}
                  onCreateNote={!hasSearchOrFilter ? handleCreateFirstNote : undefined}
                />
              ) : (
                <div className={styles.notesContainer}>
                  {pinnedNotes.length > 0 && (
                    <>
                      <Text className={styles.sectionHeader}>
                        📌 Pinned Notes
                      </Text>
                      <div className={layoutClasses[noteLayout]}>
                        {pinnedNotes.map(note => (
                          <Note
                            key={note.id}
                            note={note}
                            deleteNote={deleteNote}
                            updateNote={updateNote}
                            togglePin={togglePin}
                            notes={notes}
                            graph={linkGraph}
                            onNavigate={navigateToNote}
                            registerRef={registerNoteRef}
                            isActive={note.id === activeNoteId}
                            isHighlighted={note.id === highlightedNoteId}
                            layout={noteLayout}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {unpinnedNotes.length > 0 && (
                    <>
                      {pinnedNotes.length > 0 && (
                        <Text className={styles.sectionHeader}>
                          📝 All Notes
                        </Text>
                      )}
                      <div className={layoutClasses[noteLayout]}>
                        {unpinnedNotes.map(note => (
                          <Note
                            key={note.id}
                            note={note}
                            deleteNote={deleteNote}
                            updateNote={updateNote}
                            togglePin={togglePin}
                            notes={notes}
                            graph={linkGraph}
                            onNavigate={navigateToNote}
                            registerRef={registerNoteRef}
                            isActive={note.id === activeNoteId}
                            isHighlighted={note.id === highlightedNoteId}
                            layout={noteLayout}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Floating Graph Overlay */}
            {showGraph && notes.length > 1 && (
              <LinkGraph
                notes={notes}
                graph={linkGraph}
                activeNoteId={activeNoteId}
                onNavigate={navigateToNote}
                onSelect={setActiveNoteId}
                floating
              />
            )}
          </div>
        </main>
      </div>
    </FluentProvider>
  );
}

export default App;
