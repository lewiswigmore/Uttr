import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Text,
  Button,
  Input,
  Badge,
  makeStyles,
  tokens,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import RichEditor from './RichEditor';
import DOMPurify from 'dompurify';
import {
  DeleteRegular,
  EditRegular,
  PinRegular,
  PinFilled,
  MoreVerticalRegular,
  bundleIcon,
} from '@fluentui/react-icons';
import { formatDate } from '../utils/noteUtils';
import { tokenizeContentWithLinks, buildTitleIndex } from '../utils/linking';

const PinIcon = bundleIcon(PinFilled, PinRegular);

const useStyles = makeStyles({
  noteCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '@media (max-width: 768px)': {
      padding: '20px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
      ':hover': {
        transform: 'none',
      },
    },
  },
  pinnedCard: {
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
      marginBottom: '12px',
    },
    '@media (max-width: 480px)': {
      gap: '8px',
    },
  },
  titleSection: {
    flex: 1,
    minWidth: 0, // Allows text truncation
  },
  noteTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    marginBottom: '8px',
    wordBreak: 'break-word',
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase300,
    },
  },
  noteMetadata: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase100,
    },
  },
  actionSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    '@media (max-width: 480px)': {
      gap: '4px',
    },
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  noteContent: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: '16px',
    flex: 1,
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase200,
      marginBottom: '12px',
    },
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    '@media (max-width: 480px)': {
      marginBottom: '12px',
      gap: '4px',
    },
  },
  tag: {
    fontSize: tokens.fontSizeBase200,
    '@media (max-width: 480px)': {
      fontSize: tokens.fontSizeBase100,
    },
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    '@media (max-width: 768px)': {
      padding: '20px',
      gap: '12px',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
      gap: '8px',
    },
  },
  editButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
    '@media (max-width: 480px)': {
      flexDirection: 'column-reverse',
      gap: '8px',
      marginTop: '12px',
    },
  },
  emptyContent: {
    fontStyle: 'italic',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  pinIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '14px',
  },
  highlight: { boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.6) !important' },
  active: { outline: `2px solid ${tokens.colorBrandStroke1}` }
});

const Note = ({ note, deleteNote, updateNote, togglePin, notes = [], _graph, onNavigate, registerRef, isActive, isHighlighted }) => {
  const styles = useStyles();
  const cardRef = useRef(null);
  useEffect(() => { registerRef && registerRef(note.id, cardRef.current); }, [registerRef, note.id]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: note.title || '',
    content: note.content || '',
    tags: (note.tags || []).join(', ')
  });

  const titleIndex = buildTitleIndex(notes);

  const renderContent = () => {
    if (!note.content) return <span className={styles.emptyContent}>No content</span>;
    const tokens = tokenizeContentWithLinks(note.content);
    if (tokens.length === 0) return note.content.length > 200 ? note.content.substring(0, 200) + '...' : note.content;
    let charCount = 0;
    const MAX = 220; // truncate after some chars for card view
    const elements = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (charCount >= MAX) break;
      if (t.type === 'text') {
        const remaining = MAX - charCount;
        const slice = t.value.slice(0, remaining);
        elements.push(slice);
        charCount += slice.length;
        if (slice.length < t.value.length) break;
      } else if (t.type === 'wikilink') {
        const norm = t.value.trim().replace(/\s+/g, ' ').toLowerCase();
        const targetId = titleIndex.get(norm) || null;
        const display = t.value;
        const piece = (
          <span
            key={i + '-' + norm}
            className={`wikilink ${!targetId ? 'unresolved' : ''}`}
            onClick={e => {
              e.stopPropagation();
              if (!targetId) {
                // unresolved: could prefill new note creation in future
              } else if (onNavigate) {
                onNavigate(targetId);
              }
            }}
          >
            {display}
          </span>
        );
        const remaining = MAX - charCount;
        if (display.length + 4 <= remaining) { // account for brackets not shown
          elements.push(piece);
          charCount += display.length;
        } else {
          break;
        }
      }
    }
    if (charCount >= MAX) elements.push('...');
    return elements;
  };

  const handleSave = () => {
    const updatedNote = {
      ...note,
      title: editData.title.trim() || 'Untitled Note',
      content: editData.content.trim(),
      tags: editData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      updatedAt: new Date().toISOString()
    };
    
    updateNote(note.id, updatedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: note.title || '',
      content: note.content || '',
      tags: (note.tags || []).join(', ')
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id);
    }
  };

  const handlePin = () => {
    togglePin(note.id);
  };

  if (isEditing) {
    return (
      <Card className={styles.noteCard}>
        <div className={styles.editForm}>
          <Input
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Note title..."
            size="large"
          />
          <Input
            value={editData.tags}
            onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="Tags (comma separated)"
          />
          <RichEditor
            value={editData.content}
            onChange={(html) => setEditData(prev => ({ ...prev, content: html }))}
            placeholder="Note content..."
          />
          <div className={styles.editButtons}>
            <Button appearance="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`${styles.noteCard} ${note.isPinned ? styles.pinnedCard : ''} ${isHighlighted ? styles.highlight : ''} ${isActive ? styles.active : ''}`}
      onClick={() => setIsEditing(true)}
      ref={cardRef}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <Text className={styles.noteTitle}>
            {note.title || 'Untitled Note'}
          </Text>
          <div className={styles.noteMetadata}>
            <Text size={200}>
              {note.updatedAt ? formatDate(note.updatedAt) : 'Just now'}
            </Text>
            {note.isPinned && (
              <PinIcon className={styles.pinIcon} />
            )}
          </div>
        </div>
        
        <div className={styles.actionSection}>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button 
                appearance="subtle" 
                icon={<MoreVerticalRegular />}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem 
                  icon={<EditRegular />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  Edit Note
                </MenuItem>
                <MenuItem 
                  icon={<PinIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePin();
                  }}
                >
                  {note.isPinned ? 'Unpin Note' : 'Pin Note'}
                </MenuItem>
                <MenuItem 
                  icon={<DeleteRegular />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  Delete Note
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        {note.tags && note.tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <Badge 
                key={index} 
                className={styles.tag}
                appearance="tint"
                size="small"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        <div className={styles.noteContent}>
          {note.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content, { ALLOWED_TAGS: ['b','strong','i','em','u','pre','code','blockquote','ul','ol','li','br','p','span'] , ALLOWED_ATTR: [] }) }}
            />
          ) : renderContent()}
        </div>
  {/* Links section removed per request; inline wiki links & global graph provide navigation */}
      </div>
    </Card>
  );
};

export default Note;
