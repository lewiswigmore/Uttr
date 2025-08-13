/**
 * Utility functions for note management
 */

/**
 * Generate a unique ID for notes
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format date for display
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Show relative time for recent dates
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // Show formatted date for older dates
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Unknown date';
  }
};

/**
 * Search notes by content and tags
 * @param {Array} notes - Array of note objects
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered notes
 */
export const searchNotes = (notes, searchTerm) => {
  if (!Array.isArray(notes)) return [];
  if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) return notes;
  
  const term = searchTerm.toLowerCase().trim();
  return notes.filter(note => {
    if (!note) return false;
    
    const title = (note.title || '').toLowerCase();
    const content = (note.content || '').toLowerCase();
    const tags = Array.isArray(note.tags) ? note.tags : [];
    
    return title.includes(term) ||
           content.includes(term) ||
           tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(term));
  });
};

/**
 * Get unique tags from all notes
 * @param {Array} notes - Array of note objects
 * @returns {Array} Array of unique tags
 */
export const getAllTags = (notes) => {
  if (!Array.isArray(notes)) return [];
  
  const tagSet = new Set();
  notes.forEach(note => {
    if (note && Array.isArray(note.tags)) {
      note.tags.forEach(tag => {
        if (typeof tag === 'string' && tag.trim()) {
          tagSet.add(tag.trim());
        }
      });
    }
  });
  return Array.from(tagSet).sort();
};

/**
 * Parse tags from text input
 * @param {string} tagString - Comma-separated tag string
 * @returns {Array} Array of cleaned tags
 */
export const parseTags = (tagString) => {
  if (!tagString || typeof tagString !== 'string') return [];
  
  return tagString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && tag.length <= 50) // Max 50 chars per tag
    .slice(0, 10); // Limit to 10 tags
};
