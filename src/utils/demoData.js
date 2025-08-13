// Extended demo data set with interlinked wiki-style notes
export const demoNotes = [
  {
    id: 'n-001',
    title: 'Uttr Workspace Overview',
    content: `Welcome to your evolving knowledge space.

This hub links into core areas:
• Product Direction → [[Project Atlas Vision]]
• Active Tasks → [[Project Atlas Task Board]]
• Technical Concepts → [[Design Patterns Overview]], [[Event Sourcing Basics]]
• Personal Productivity → [[Weekly Review Checklist]], [[Daily Planner Template]]
• Idea Funnel → [[Idea Incubator]]
• Data Export → [[Export Formats Spec]]

Uncreated (ghost) future pages:
- [[Graph View Ideas]]
- [[Collaboration Plan]]
- [[Mobile App Roadmap]]

Suggested next: build [[Graph View Ideas]] to visualize connections.`,
    tags: ['hub', 'meta'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isPinned: true
  },
  {
    id: 'n-002',
    title: 'Project Atlas Vision',
    content: `Core articulation of what Atlas means:

Goal: A frictionless, resilient note system with:
1. Fast capture (see [[Inbox (Raw Captures)]])
2. Rich linking (see [[Uttr Workspace Overview]])
3. Navigable knowledge graph (planned: [[Graph View Ideas]])
4. Collaborative layer (future: [[Collaboration Plan]])

Related execution surface:
- Task breakdown: [[Project Atlas Task Board]]
- Architecture notes: [[Atlas Technical Architecture]]

Repeated reference test: [[Project Atlas Vision]] should not duplicate backlinks.

Next doc to draft: [[Refactoring Strategy]].`,
    tags: ['project', 'vision'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    isPinned: true
  },
  {
    id: 'n-003',
    title: 'Project Atlas Task Board',
    content: `Current sprint focus:

Backlog Columns:
• Capture → Implement quick create enhancements (ref [[Daily Planner Template]] for UX cues)
• Graph → Parse and render backlinks (done; see [[Uttr Workspace Overview]])
• UI Polish → Flat design final pass + spacing audit
• Future → [[Graph View Ideas]], [[Mobile App Roadmap]]

Dependencies:
- Vision alignment in [[Project Atlas Vision]]
- Architecture constraints in [[Atlas Technical Architecture]]`,
    tags: ['project', 'tasks'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.2).toISOString(),
    isPinned: false
  },
  {
    id: 'n-004',
    title: 'Atlas Technical Architecture',
    content: `Overview:

Layers:
- UI: React + Fluent components
- State: localStorage sync + derived graphs (see [[Link Graph Derivation]])
- Linking: runtime parsing (see [[Design Patterns Overview]])
- Planned modules: [[Export Formats Spec]], [[Collaboration Plan]]

Further modeling:
- Event pipeline inspiration from [[Event Sourcing Basics]] & [[CQRS Explained]]
- Domain boundaries shaped by [[Domain Modeling Notes]]`,
    tags: ['architecture', 'project'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isPinned: false
  },
  {
    id: 'n-005',
    title: 'Link Graph Derivation',
    content: `Runtime process:

1. Index titles → note id map
2. Extract tokens via pattern
3. Resolve to ids (skip self)
4. Invert to generate backlinks

Inbound examples:
- Comes from [[Atlas Technical Architecture]]
- Also from [[Uttr Workspace Overview]] (indirect concept)
- Add usage in [[Project Atlas Task Board]] when graph view scheduled

Next exploration: visual map in [[Graph View Ideas]].`,
    tags: ['architecture', 'linking'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    isPinned: false
  },
  {
    id: 'n-006',
    title: 'Design Patterns Overview',
    content: `Patterns in use:

• Builder (note objects assembled in form)
• Observer-ish (UI reacting to content changes)
• Graph transformation (see [[Link Graph Derivation]])
• Future candidate: Command pattern for undo
• Potential event stream: [[Event Sourcing Basics]]

Deeper domain shaping: [[Domain Modeling Notes]]`,
    tags: ['patterns', 'architecture'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isPinned: false
  },
  {
    id: 'n-007',
    title: 'Event Sourcing Basics',
    content: `Key ideas:

Instead of storing final state, store events:
- creation, edit, tag add/remove
- Could enable future undo + sync

Related concept: [[CQRS Explained]]
Applies to: [[Atlas Technical Architecture]], [[Design Patterns Overview]]`,
    tags: ['architecture', 'events'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    isPinned: false
  },
  {
    id: 'n-008',
    title: 'CQRS Explained',
    content: `Command Query Responsibility Segregation:

Separate write model from read model.
Potential synergy with:
- [[Event Sourcing Basics]] (source of truth)
- Derived read models (like [[Link Graph Derivation]])

May influence [[Atlas Technical Architecture]].`,
    tags: ['architecture', 'patterns'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    isPinned: false
  },
  {
    id: 'n-009',
    title: 'Domain Modeling Notes',
    content: `Entities & Concepts:

• Note
• Tag (derived, no separate entity yet)
• Link (implicit via pattern)
• Graph (computed projection)
• Future: User, Workspace, SyncSession

Influencers: [[Design Patterns Overview]], [[Event Sourcing Basics]].`,
    tags: ['domain', 'architecture'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    isPinned: false
  },
  {
    id: 'n-010',
    title: 'Daily Planner Template',
    content: `Template:

Morning:
- Focus block
- Process inbox → [[Inbox (Raw Captures)]]

Midday:
- Review tasks in [[Project Atlas Task Board]]

Evening:
- Update progress in [[Project Atlas Vision]]
- Mark learnings in [[Learning Roadmap]]`,
    tags: ['productivity', 'template'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
    isPinned: false
  },
  {
    id: 'n-011',
    title: 'Weekly Review Checklist',
    content: `Checklist:

1. Clear [[Inbox (Raw Captures)]]
2. Reprioritize [[Project Atlas Task Board]]
3. Update metrics in [[Project Atlas Vision]]
4. Capture learnings in [[Learning Roadmap]]
5. Archive finished tasks
6. Identify blocked items → note under [[Refactoring Strategy]] (future)`,
    tags: ['productivity', 'review'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    isPinned: false
  },
  {
    id: 'n-012',
    title: 'Inbox (Raw Captures)',
    content: `Unprocessed:

• Consider adding offline mode (relates to [[Mobile App Roadmap]])
• Idea: visual matrix view → [[Graph View Ideas]]
• Need schema doc: [[Export Formats Spec]]
• Research collaborative cursors → [[Collaboration Plan]]

Process weekly (see [[Weekly Review Checklist]])`,
    tags: ['inbox', 'capture'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isPinned: false
  },
  {
    id: 'n-013',
    title: 'Learning Roadmap',
    content: `Focus Areas:

Architecture:
- Read: [[Event Sourcing Basics]], then [[CQRS Explained]]
- Apply to: [[Atlas Technical Architecture]]

User Experience:
- Study linking flows (enhance [[Uttr Workspace Overview]])

Potential backlog: [[Refactoring Strategy]] to align code style.`,
    tags: ['learning', 'roadmap'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isPinned: false
  },
  {
    id: 'n-014',
    title: 'Idea Incubator',
    content: `Seeds:

• Inline slash commands (tie into [[Refactoring Strategy]])
• Card color accents based on tag density
• Timeline view referencing [[Project Atlas Vision]]
• Relationship explorer (graph) = [[Graph View Ideas]]
• Ambient focus mode referencing tasks in [[Project Atlas Task Board]]`,
    tags: ['ideas', 'incubator'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isPinned: false
  },
  {
    id: 'n-015',
    title: 'Meal Planning Index',
    content: `Weekly plan links:

• Breakfast options → [[High-Protein Breakfast Ideas]]
• Fast dinners → [[Quick 10-Minute Meals]]
• To experiment: [[Fermentation Log]] (future)
• See productivity spillover in [[Daily Planner Template]] (energy link)`,
    tags: ['life', 'meal-planning'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    isPinned: false
  },
  {
    id: 'n-016',
    title: 'High-Protein Breakfast Ideas',
    content: `Options:
- Greek yogurt + berries
- Veggie omelette
- Chia pudding (prep night before)

Reference plan: [[Meal Planning Index]]
Track variants in [[Quick 10-Minute Meals]] if simplified.`,
    tags: ['food', 'health'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    isPinned: false
  },
  {
    id: 'n-017',
    title: 'Quick 10-Minute Meals',
    content: `Fast Dinners:
- Stir fry (any veggies)
- Avocado toast w/ smoked salmon
- Couscous bowl

Cross references:
- Breakfast correlation: [[High-Protein Breakfast Ideas]]
- Weekly context: [[Meal Planning Index]]`,
    tags: ['food', 'quick'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 62).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    isPinned: false
  },
  {
    id: 'n-018',
    title: 'Reading Queue 2025',
    content: `Pipeline:

1. Systems thinking (influence [[Domain Modeling Notes]])
2. Event-driven architectures (reinforce [[Event Sourcing Basics]])
3. UX strategy (improve interaction in [[Uttr Workspace Overview]])

Will spawn note: [[Book Notes – Deep Work]] once started.`,
    tags: ['reading', 'learning'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 65).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    isPinned: false
  },
  {
    id: 'n-019',
    title: 'Book Notes – Deep Work',
    content: `Key Principles (applied to coding sessions):

• Protect focus blocks (see [[Daily Planner Template]])
• Reduce context switching (structure [[Project Atlas Task Board]])
• Ritualize startup & shutdown (embed into [[Weekly Review Checklist]])

Meta anchors: [[Reading Queue 2025]]`,
    tags: ['reading', 'focus'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 66).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    isPinned: false
  },
  {
    id: 'n-020',
    title: 'Design Aesthetic Notes',
    content: `Principles:

• Flat surface styling
• Emphasize space over borders
• Link coloration subtle (see [[Uttr Workspace Overview]])
• Graph styling planned → [[Graph View Ideas]]

Possible refactor captured in [[Refactoring Strategy]] (future).`,
    tags: ['design', 'ui'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isPinned: false
  }
  ,{
    id: 'n-021',
    title: 'Graph View Ideas',
    content: `Brainstorming graph improvements:

• Force-directed layout (partially done) 
• Tag clustering rings
• Focus lens: isolate neighborhood of active note (see [[Uttr Workspace Overview]])
• Hide low-degree noise nodes
• Mini-map + zoom history
• Inline create on unresolved link (ties to [[Refactoring Strategy]])

References: [[Link Graph Derivation]], [[Design Aesthetic Notes]]
Future collaboration aspects: [[Collaboration Plan]]`,
    tags: ['graph','ideas','visualization'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6.5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.2).toISOString(),
    isPinned: false
  },
  {
    id: 'n-022',
    title: 'Collaboration Plan',
    content: `Initial multi-user strategy:

Phases:
1. Presence indicators (avatar dots)
2. Live cursor ghosts (depends on event model -> [[Event Sourcing Basics]])
3. Conflict resolution via merge rules (see [[Domain Modeling Notes]])
4. Shared workspaces & permissions layer

Graph considerations: focus sharing similar to [[Graph View Ideas]] proposals.
Export alignment: ensure format in [[Export Formats Spec]].`,
    tags: ['collaboration','roadmap'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(),
    isPinned: false
  },
  {
    id: 'n-023',
    title: 'Mobile App Roadmap',
    content: `Aim: Lightweight capture + offline sync.

Milestones:
• Phase 1: Offline cache, local queue (relates [[Inbox (Raw Captures)]])
• Phase 2: Background sync events (reuse patterns from [[Event Sourcing Basics]])
• Phase 3: Graph mini viewer (subset of [[Graph View Ideas]])
• Phase 4: Collaboration parity (see [[Collaboration Plan]])

Design constraints drawn from [[Design Aesthetic Notes]].`,
    tags: ['mobile','roadmap'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    isPinned: false
  },
  {
    id: 'n-024',
    title: 'Refactoring Strategy',
    content: `Refactoring pillars:

1. Extract pure linking module (done: [[Link Graph Derivation]])
2. Split visualization adapters (future: [[Graph View Ideas]])
3. Introduce command/event layer (ties to [[Event Sourcing Basics]] + [[CQRS Explained]])
4. Shared UI primitives library (align with [[Design Aesthetic Notes]])
5. Progressive enhancement: unresolved link quick-create

Cross-cutting concerns: collaboration hooks (see [[Collaboration Plan]]).`,
    tags: ['refactoring','architecture'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isPinned: false
  },
  {
    id: 'n-025',
    title: 'Export Formats Spec',
    content: `Export objectives:

• Portable JSON w/ metadata
• Future: Markdown bundle with wikilink translation
• Graph adjacency list (inspired by [[Link Graph Derivation]])
• Incremental diff packet for sync (ties into [[Event Sourcing Basics]])

Must coordinate with: [[Collaboration Plan]], [[Refactoring Strategy]].`,
    tags: ['export','spec'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    isPinned: false
  }
];

// Function to load demo data (overwrites existing notes)
export const loadDemoData = () => {
  localStorage.setItem('uttr-notes', JSON.stringify(demoNotes));
  window.location.reload();
};
