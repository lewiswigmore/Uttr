import React, { useState, forwardRef, useRef } from 'react';
import {
  Input,
  Button,
  Card,
  Text,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import RichEditor from './RichEditor';
import { AddRegular } from '@fluentui/react-icons';
import { generateId, parseTags } from '../utils/noteUtils';

const useStyles = makeStyles({
  formCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '12px',
    marginBottom: '32px',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    ':focus-within': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  formContainer: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '@media (max-width: 768px)': {
      padding: '16px 20px',
      gap: '12px',
    },
    '@media (max-width: 480px)': {
      padding: '12px 16px',
      gap: '12px',
    },
  },
  collapsedContainer: {
    padding: '16px 24px',
    '@media (max-width: 768px)': {
      padding: '12px 20px',
    },
    '@media (max-width: 480px)': {
      padding: '10px 16px',
    },
  },
  inputRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '12px',
    },
    '@media (max-width: 480px)': {
      gap: '8px',
    },
  },
  titleInput: {
    flex: 2,
    '@media (max-width: 768px)': {
      flex: 'none',
      width: '100%',
    },
  },
  tagInput: {
    flex: 1,
    '@media (max-width: 768px)': {
      flex: 'none',
      width: '100%',
    },
  },
  contentTextarea: {
    minHeight: '100px',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
    '@media (max-width: 480px)': {
      flexDirection: 'column-reverse',
      gap: '8px',
    },
  },
  helperText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    padding: '0 4px',
    fontStyle: 'italic',
  },
});

const NoteForm = forwardRef(({ addNote }, ref) => {
  const styles = useStyles();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [linkQuery, setLinkQuery] = useState(null); // { start, text }
  const titleInputRef = useRef(null);

  // Focus title input when called from outside
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        setIsExpanded(true);
      }
    }
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'content') {
      // Detect wiki link pattern [[...partial
      const uptoCursor = value; // no cursor position for now; simple last pattern
  const match = /\[\[([^\]\n]*)$/.exec(uptoCursor);
      if (match) {
        setLinkQuery({ text: match[1] });
      } else if (linkQuery) {
        setLinkQuery(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() && !formData.content.trim()) {
      return;
    }

    setIsSaving(true);

    const newNote = {
      id: generateId(),
      title: formData.title.trim() || 'Untitled Note',
      content: formData.content.trim(),
      tags: parseTags(formData.tags),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false
    };

    // Simulate a brief save animation
    setTimeout(() => {
      addNote(newNote);
      setFormData({ title: '', content: '', tags: '' });
      setIsExpanded(false);
      setIsSaving(false);
    }, 300);
  };

  const handleKeyDown = (e) => {
    // Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
    // Escape to collapse form
    if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      setIsExpanded(false);
      if (titleInputRef.current) {
        titleInputRef.current.blur();
      }
    }
  };

  const handleReset = () => {
    setFormData({ title: '', content: '', tags: '' });
    setIsExpanded(false);
  };

  const hasContent = formData.title.trim() || formData.content.trim();

  return (
    <Card className={styles.formCard}>
      <form 
        onSubmit={handleSubmit} 
        className={isExpanded ? styles.formContainer : styles.collapsedContainer} 
        onKeyDown={handleKeyDown}
      >
        <div className={styles.inputRow}>
          <Input
            className={styles.titleInput}
            placeholder={isExpanded ? "Note title..." : "Quick add a note..."}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onFocus={() => setIsExpanded(true)}
            size="large"
            ref={titleInputRef}
          />
          {isExpanded && (
            <Input
              className={styles.tagInput}
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          )}
        </div>
        
        {isExpanded && (
          <>
            <RichEditor
              value={formData.content}
              onChange={(html) => handleInputChange('content', html)}
              placeholder="Write your note content here... Use [[Note Title]] to link."
            />
            {linkQuery && (
              <Text className={styles.helperText}>Linking: {linkQuery.text || 'start typing a title...'}</Text>
            )}
            <Text className={styles.helperText}>
              💡 Tip: Use tags to organize your notes. Press ⌘+Enter (Ctrl+Enter) to save quickly, ESC to minimize.
            </Text>
            
            <div className={styles.buttonContainer}>
              <Button 
                appearance="secondary" 
                onClick={handleReset}
                disabled={!hasContent}
              >
                Cancel
              </Button>
              <Button 
                appearance="primary" 
                type="submit" 
                icon={<AddRegular />}
                disabled={!hasContent || isSaving}
              >
                {isSaving ? 'Saving...' : 'Add Note'}
              </Button>
            </div>
          </>
        )}
        
        {!isExpanded && (
          <div className={styles.buttonContainer}>
            <Button 
              appearance="primary" 
              type="submit" 
              icon={<AddRegular />}
              disabled={!hasContent}
            >
              Quick Add
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
});

export default NoteForm;