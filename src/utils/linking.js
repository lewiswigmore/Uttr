// Utilities for bi-directional wiki-style linking using [[Note Title]] syntax
// Parsing is intentionally lightweight and runs in O(n) over content length.

// Extract unique, normalized wiki link tokens from note content
export function extractWikiLinks(content) {
  if (!content || typeof content !== 'string') return [];
  // Strip HTML tags that may appear from WYSIWYG content, but keep [[...]] tokens
  const plain = content.replace(/<[^>]*>/g, ' ');
  content = plain;
  const pattern = /\[\[([^\]\n]+)\]\]/g; // stop at newline or first closing brackets
  const seen = new Set();
  let match;
  while ((match = pattern.exec(content)) !== null) {
    let raw = match[1].trim();
    if (!raw) continue;
    // Normalize: collapse whitespace, limit length, lowercase for index lookup
    raw = raw.replace(/\s+/g, ' ').slice(0, 120);
    const norm = raw.toLowerCase();
    if (!seen.has(norm)) seen.add(norm);
  }
  return Array.from(seen);
}

// Build a title index (normalized title -> id)
export function buildTitleIndex(notes) {
  const idx = new Map();
  (notes || []).forEach(n => {
    if (n && n.title) {
      const norm = n.title.trim().replace(/\s+/g, ' ').toLowerCase();
      if (!idx.has(norm)) idx.set(norm, n.id); // first title wins to avoid churn
    }
  });
  return idx;
}

// Build a link graph with mentions + backlinks
export function buildLinkGraph(notes) {
  const titleIndex = buildTitleIndex(notes);
  const graph = {};
  (notes || []).forEach(n => {
    const links = extractWikiLinks(n.content);
    const mentions = [];
    links.forEach(token => {
      const targetId = titleIndex.get(token);
      if (targetId && targetId !== n.id) {
        mentions.push(targetId);
      }
    });
    graph[n.id] = { mentions, backlinks: [] };
  });
  // Invert for backlinks
  Object.entries(graph).forEach(([id, data]) => {
    data.mentions.forEach(targetId => {
      if (graph[targetId]) graph[targetId].backlinks.push(id);
    });
  });
  return graph;
}

// Resolve a raw link token to note id (returns null if unresolved)
export function resolveLink(rawText, notes) {
  if (!rawText) return null;
  const norm = rawText.trim().replace(/\s+/g, ' ').toLowerCase();
  const titleIndex = buildTitleIndex(notes);
  return titleIndex.get(norm) || null;
}

// Tokenize content into plain text + wikilink tokens
export function tokenizeContentWithLinks(content) {
  const parts = [];
  if (!content) return parts;
  const pattern = /\[\[([^\]\n]+)\]\]/g;
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const full = match[0];
    const inner = match[1];
    const start = match.index;
    if (start > lastIndex) parts.push({ type: 'text', value: content.slice(lastIndex, start) });
    parts.push({ type: 'wikilink', value: inner });
    lastIndex = start + full.length;
  }
  if (lastIndex < content.length) parts.push({ type: 'text', value: content.slice(lastIndex) });
  return parts;
}
