import React, { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  editor: {
    minHeight: '140px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    background: tokens.colorNeutralBackground1,
    outline: 'none',
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
    whiteSpace: 'pre-wrap',
    overflowY: 'auto',
    cursor: 'text',
    ':focus': {
      borderColor: tokens.colorBrandStroke1,
      boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1Hover}`
    }
  },
  toolbar: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8
  },
  btn: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    background: tokens.colorNeutralBackground2,
    padding: '4px 8px',
    fontSize: tokens.fontSizeBase200,
    borderRadius: 6,
    cursor: 'pointer',
    ':hover': { background: tokens.colorNeutralBackground3 }
  }
});

// Basic commands mapping
const actions = [
  { k: 'bold', label: 'B', cmd: () => document.execCommand('bold') },
  { k: 'italic', label: 'I', cmd: () => document.execCommand('italic') },
  { k: 'underline', label: 'U', cmd: () => document.execCommand('underline') },
  { k: 'code', label: '</>', cmd: () => document.execCommand('formatBlock', false, 'pre') },
  { k: 'ul', label: '• List', cmd: () => document.execCommand('insertUnorderedList') },
  { k: 'ol', label: '1. List', cmd: () => document.execCommand('insertOrderedList') },
  { k: 'quote', label: '❝', cmd: () => document.execCommand('formatBlock', false, 'blockquote') }
];

export default function RichEditor({ value, onChange, placeholder }) {
  const styles = useStyles();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  function handleInput() {
    if (!ref.current) return;
    const clean = DOMPurify.sanitize(ref.current.innerHTML, { ALLOWED_TAGS: ['b','strong','i','em','u','pre','code','blockquote','ul','ol','li','br','p','span'], ALLOWED_ATTR: [] });
    onChange && onChange(clean);
  }

  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }

  return (
    <div>
      <div className={styles.toolbar}>
        {actions.map(a => (
          <button type="button" key={a.k} className={styles.btn} onMouseDown={e => { e.preventDefault(); a.cmd(); handleInput(); }}>
            {a.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        className={styles.editor}
        contentEditable
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />
    </div>
  );
}
