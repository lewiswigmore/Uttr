import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Card, Text, makeStyles, tokens, Button, Checkbox, Input, Tooltip, Radio, RadioGroup } from '@fluentui/react-components';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
  bottom: '28px',
  right: '28px',
  width: '460px',
  height: '460px',
    zIndex: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'auto',
    transition: 'all 0.38s cubic-bezier(.22,.83,.43,.99)',
    willChange: 'width,height,transform,bottom,right,left,top',
  // make sure absolutely positioned outer resize handles align
  boxSizing: 'border-box'
  },
  expanded: {
    bottom: 'auto',
    right: 'auto',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(1600px, calc(100vw - 84px))',
    height: 'calc(100vh - 120px)',
    zIndex: 120,
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.28)',
    backdropFilter: 'blur(4px) saturate(140%)',
    WebkitBackdropFilter: 'blur(4px) saturate(140%)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.35s ease',
    zIndex: 110,
  },
  backdropVisible: { opacity: 1, pointerEvents: 'auto' },
  floatingCard: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '18px',
    padding: '10px 12px 14px',
    background: `linear-gradient(165deg, ${tokens.colorNeutralBackground3} 0%, ${tokens.colorNeutralBackground2} 100%)`,
    boxShadow: '0 4px 18px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.04)',
    backdropFilter: 'blur(10px) saturate(140%)',
    transition: 'border-radius 0.4s ease',
  },
  floatingCardExpanded: { borderRadius: 32 },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8, flexWrap: 'wrap' },
  controlsRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  svgWrapper: {
    width: '100%',
    flex: 1,
    position: 'relative',
    borderRadius: 12,
    overflow: 'visible', // allow nodes to extend outside
    background: `radial-gradient(circle at 30% 30%, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground2} 60%)`,
    WebkitMaskImage: 'linear-gradient(#000 92%, transparent)',
  },
  canvas: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    background: `repeating-linear-gradient(0deg, transparent 0 38px, rgba(255,255,255,0.04) 38px 39px), repeating-linear-gradient(90deg, transparent 0 38px, rgba(255,255,255,0.04) 38px 39px), linear-gradient(160deg, ${tokens.colorNeutralBackground2} 0%, ${tokens.colorNeutralBackground3} 90%)`,
  },
  miniToolbar: {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'flex',
    gap: 4,
    background: tokens.colorNeutralBackground1,
    padding: '4px 6px',
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
  },
  nodeLabel: { pointerEvents: 'none', fontSize: '10px', fill: tokens.colorNeutralForeground2 },
  legend: { fontSize: tokens.fontSizeBase200, opacity: 0.65 },
  metricsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: tokens.fontSizeBase200,
    padding: '4px 8px',
    background: tokens.colorNeutralBackground3,
    borderRadius: 10,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)'
  },
  sizeIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    padding: '4px 10px 5px',
    fontSize: tokens.fontSizeBase200,
    background: 'rgba(0,0,0,0.45)',
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: 8,
    letterSpacing: '0.5px',
    fontWeight: tokens.fontWeightSemibold,
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    pointerEvents: 'none',
    backdropFilter: 'blur(3px)'
  },
  // Unified invisible border resize areas
  outerResizeBase: {
    position: 'absolute',
    zIndex: 200,
    userSelect: 'none',
    background: 'transparent',
    // Slightly extend outside so user can grab window edges without hunting
    '&:after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 10,
    },
    transition: 'background 0.12s ease'
  },
  outerTop: { top: -2, left: 0, right: 0, height: 8, cursor: 'ns-resize' },
  outerBottom: { bottom: -2, left: 0, right: 0, height: 10, cursor: 'ns-resize' },
  outerLeft: { top: 0, bottom: 0, left: -2, width: 8, cursor: 'ew-resize' },
  outerRight: { top: 0, bottom: 0, right: -2, width: 8, cursor: 'ew-resize' },
  outerTL: { top: -4, left: -4, width: 14, height: 14, cursor: 'nwse-resize' },
  outerTR: { top: -4, right: -4, width: 14, height: 14, cursor: 'nesw-resize' },
  outerBL: { bottom: -4, left: -4, width: 14, height: 14, cursor: 'nesw-resize' },
  outerBR: { bottom: -4, right: -4, width: 14, height: 14, cursor: 'nwse-resize' },
  outerResizeHover: { background: 'rgba(255,255,255,0.07)' },
  miniButton: {
    position: 'fixed',
    bottom: 18,
    right: 18,
    zIndex: 70,
    width: 54,
    height: 54,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(145deg, ${tokens.colorNeutralBackground3} 0%, ${tokens.colorNeutralBackground2} 100%)`,
    boxShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px) saturate(140%)',
    cursor: 'pointer',
    transition: 'transform .3s ease, box-shadow .3s ease',
  },
  miniButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 22px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)'
  }
});

// Basic force simulation (very lightweight)
function simulate(nodes, links, iterations = 160) {
  const repulsion = 4200; // tweak
  const linkDistance = 110;
  const damping = 0.85;
  for (let i = 0; i < iterations; i++) {
    // repulsion
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[b].x - nodes[a].x;
        const dy = nodes[b].y - nodes[a].y;
  const distSq = dx * dx + dy * dy || 0.01;
        const force = repulsion / distSq;
        const fx = force * dx / Math.sqrt(distSq);
        const fy = force * dy / Math.sqrt(distSq);
        nodes[a].vx -= fx; nodes[a].vy -= fy;
        nodes[b].vx += fx; nodes[b].vy += fy;
      }
    }
    // attraction
    links.forEach(l => {
      const a = nodes.find(n => n.id === l.from);
      const b = nodes.find(n => n.id === l.to);
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const desired = linkDistance;
      const diff = (dist - desired) * 0.02;
      const fx = diff * dx / dist;
      const fy = diff * dy / dist;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    });
    // integrate
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      n.vx *= damping; n.vy *= damping;
    });
  }
}

const LinkGraph = ({ notes, graph, activeNoteId, onNavigate, onSelect, floating = true, onClose }) => {
  const styles = useStyles();
  const [direction, setDirection] = useState('out'); // 'out' | 'in'
  const [focusActive, setFocusActive] = useState(true);
  const [filter, setFilter] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragTick, setDragTick] = useState(0); // force re-render during drags
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [size, setSize] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('uttr-graph-size')); if (saved?.w && saved?.h) return saved; } catch(_){}
    return { w: 460, h: 460 };
  });
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('uttr-graph-pos')); if (saved && typeof saved.x === 'number') return saved; } catch(_){}
    return { mode: 'anchored', x: null, y: null }; // anchored uses bottom/right
  });
  const resizing = useRef(null); // { corner, startX, startY, startW, startH, startLeft, startTop }
  const movingWin = useRef(null);
  const svgRef = useRef(null);
  const dragging = useRef(null);
  const panning = useRef(null);
  const wrapperRef = useRef(null);

  const filteredNotes = useMemo(() => {
    if (!filter.trim()) return notes;
    const q = filter.toLowerCase();
    return notes.filter(n => (n.title || '').toLowerCase().includes(q));
  }, [notes, filter]);

  const { nodes, links } = useMemo(() => {
    const base = filteredNotes.map((n, i) => ({ id: n.id, title: n.title || 'Untitled', x: Math.cos(i) * 150, y: Math.sin(i) * 150, vx: 0, vy: 0, degree: 0 }));
    const baseMap = new Map(base.map(n => [n.id, n]));
    const rawLinks = [];
    filteredNotes.forEach(n => {
      const g = graph[n.id];
      if (!g) return;
      if (direction === 'out') {
        g.mentions.forEach(t => { if (baseMap.has(t)) rawLinks.push({ from: n.id, to: t, dir: 'out' }); });
      } else {
        g.backlinks.forEach(b => { if (baseMap.has(b)) rawLinks.push({ from: b, to: n.id, dir: 'in' }); });
      }
    });
    rawLinks.forEach(l => { baseMap.get(l.from).degree++; baseMap.get(l.to).degree++; });
    simulate(base, rawLinks, 120);
    return { nodes: base, links: rawLinks };
  }, [filteredNotes, graph, direction]);

  const activeSet = useMemo(() => {
    if (!focusActive || !activeNoteId) return null;
    const related = new Set([activeNoteId]);
    const g = graph[activeNoteId];
    if (g) {
      g.mentions.forEach(id => related.add(id));
      g.backlinks.forEach(id => related.add(id));
    }
    return related;
  }, [focusActive, activeNoteId, graph]);

  // dragging / panning logic
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function handleDown(e) {
      const nodeEl = e.target.closest('circle[data-id]');
      if (nodeEl) {
        dragging.current = { id: nodeEl.getAttribute('data-id'), ox: e.clientX, oy: e.clientY };
        return;
      }
      // start panning if background
      panning.current = { ox: e.clientX, oy: e.clientY, startPan: { ...pan } };
    }
    function handleMove(e) {
      if (dragging.current) {
        const node = nodes.find(n => n.id === dragging.current.id);
        if (node) {
          node.x += (e.clientX - dragging.current.ox) / zoom;
          node.y += (e.clientY - dragging.current.oy) / zoom;
          dragging.current.ox = e.clientX; dragging.current.oy = e.clientY;
          setDragTick(t => t + 1);
        }
      } else if (panning.current) {
        const dx = (e.clientX - panning.current.ox);
        const dy = (e.clientY - panning.current.oy);
        setPan({ x: panning.current.startPan.x + dx, y: panning.current.startPan.y + dy });
      }
    }
    function handleUp() {
      dragging.current = null; panning.current = null;
    }
    svg.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      svg.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [nodes, pan, zoom]);

  // removed unused tick state (was formerly used to force re-render)

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    // zoom to mouse position for better UX
    const rect = svgRef.current?.getBoundingClientRect();
    const mx = e.clientX - (rect?.left || 0) - pan.x - (rect?.width || 0)/2;
    const my = e.clientY - (rect?.top || 0) - pan.y - (rect?.height || 0)/2;
    setZoom(z => {
      const newZ = Math.min(3, Math.max(0.35, z + delta));
      const scaleFactor = newZ / z;
      setPan(p => ({ x: p.x - mx * (scaleFactor - 1), y: p.y - my * (scaleFactor - 1) }));
      return newZ;
    });
  };

  function resetView() { setZoom(1); setPan({ x: 0, y: 0 }); }

  const fitView = useCallback(() => {
    if (!nodes.length) return;
    const bbox = nodes.reduce((acc, n) => ({
      minX: Math.min(acc.minX, n.x),
      maxX: Math.max(acc.maxX, n.x),
      minY: Math.min(acc.minY, n.y),
      maxY: Math.max(acc.maxY, n.y),
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    const width = Math.max(1, bbox.maxX - bbox.minX);
    const height = Math.max(1, bbox.maxY - bbox.minY);
    const container = wrapperRef.current?.getBoundingClientRect();
    if (!container) return;
    const padding = 40;
    const scaleX = (container.width - padding) / width;
    const scaleY = (container.height - padding) / height;
    const newZoom = Math.min(2.2, Math.max(0.2, Math.min(scaleX, scaleY)));
    setZoom(newZoom);
    // center
    const cx = (bbox.minX + bbox.maxX) / 2;
    const cy = (bbox.minY + bbox.maxY) / 2;
    setPan({ x: -cx * newZoom, y: -cy * newZoom });
  }, [nodes]);

  const handleNodeClick = (id) => {
    if (dragging.current) return; // ignore click if ended drag same frame
    onSelect && onSelect(id);
  };
  const handleNodeDoubleClick = (id) => {
    onNavigate && onNavigate(id);
  };

  // collapse on ESC
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape' && expanded) setExpanded(false); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expanded]);

  // persist size
  useEffect(() => { try { localStorage.setItem('uttr-graph-size', JSON.stringify(size)); } catch(_){} }, [size]);

  // resize listeners
  useEffect(() => {
    function onMove(e) {
      if (resizing.current) {
        const { startX, startY, startW, startH, corner, startLeft, startTop } = resizing.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newW = startW;
        let newH = startH;
        let newLeft = startLeft;
        let newTop = startTop;
        const minW = 300;
        const minH = 300;
        // Corner logic
        if (corner.includes('r')) { // right side -> width grows with +dx
          newW = startW + dx;
        }
        if (corner.includes('l')) { // left side -> width grows inversely
          newW = startW - dx;
          newLeft = startLeft + dx;
        }
        if (corner.includes('b')) { // bottom -> height grows with +dy
          newH = startH + dy;
        }
        if (corner.includes('t')) { // top -> height grows inversely
          newH = startH - dy;
          newTop = startTop + dy;
        }
        // Constraints
        if (newW < minW) { // adjust left if shrinking from left
          if (corner.includes('l')) newLeft += (newW - minW) * -1; // compensate
          newW = minW;
        }
        if (newH < minH) {
          if (corner.includes('t')) newTop += (newH - minH) * -1;
          newH = minH;
        }
        newW = Math.min(newW, window.innerWidth - 40);
        newH = Math.min(newH, window.innerHeight - 80);
        setSize({ w: newW, h: newH });
        // Always free position when resizing
        setPosition({ mode: 'free', x: newLeft, y: newTop });
      }
    }
  function onUp() { if (resizing.current) setIsResizing(false); resizing.current = null; }
    function onMoveWindow(e) {
      if (!movingWin.current) return;
      const dx = e.clientX - movingWin.current.startX;
      const dy = e.clientY - movingWin.current.startY;
      let nx = movingWin.current.startLeft + dx;
      let ny = movingWin.current.startTop + dy;
      // constrain
      nx = Math.min(window.innerWidth - 120, Math.max(12, nx));
      ny = Math.min(window.innerHeight - 100, Math.max(12, ny));
      setPosition({ mode: 'free', x: nx, y: ny });
    }
    function onUpWindow() { movingWin.current = null; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMoveWindow);
    window.addEventListener('mouseup', onUpWindow);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const startResize = (e, corner) => {
    e.preventDefault(); e.stopPropagation();
    if (expanded || minimized) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    resizing.current = { corner, startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h, startLeft: rect.left, startTop: rect.top };
    setIsResizing(true);
    if (position.mode !== 'free') setPosition({ mode: 'free', x: rect.left, y: rect.top });
  };

  const toggleExpand = () => { if (minimized) setMinimized(false); setExpanded(e => !e); };
  const toggleMinimize = () => { if (expanded) setExpanded(false); setMinimized(m => !m); };

  const startMoveWindow = (e) => {
    if (expanded || minimized) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    movingWin.current = { startX: e.clientX, startY: e.clientY, startLeft: rect.left, startTop: rect.top };
    if (position.mode !== 'free') {
      setPosition({ mode: 'free', x: rect.left, y: rect.top });
    }
  };

  // persist position when free
  useEffect(()=>{ if (position.mode === 'free') { try { localStorage.setItem('uttr-graph-pos', JSON.stringify(position)); } catch(_){} } }, [position]);

  return (
    <>
      {expanded && <div className={`${styles.backdrop} ${expanded ? styles.backdropVisible : ''}`} onClick={() => setExpanded(false)} />}
      {minimized && !expanded && (
        <div className={styles.miniButton} onClick={() => setMinimized(false)} title="Open Graph">
          <span style={{ fontSize: 22 }}>🕸️</span>
        </div>
      )}
      <div
        className={`${floating ? styles.overlay : ''} ${expanded ? styles.expanded : ''}`}
        ref={wrapperRef}
  style={expanded ? {} : minimized ? { pointerEvents: 'none', opacity: 0, transform: 'translateY(20px) scale(.9)' } : position.mode === 'free' ? { width: size.w, height: size.h, left: position.x, top: position.y, bottom: 'auto', right: 'auto' } : { width: size.w, height: size.h }}
      >
      <Card className={`${styles.floatingCard} ${expanded ? styles.floatingCardExpanded : ''}`} style={minimized ? { display: 'none' } : undefined}>
  <div className={styles.headerRow} onMouseDown={startMoveWindow} onDoubleClick={() => !minimized && toggleExpand()} style={{ cursor: expanded || minimized ? 'default' : 'move' }}>
          <Text weight="semibold" size={300}>Graph</Text>
          <div style={{ display: 'flex', gap: 4 }}>
            <Tooltip content="Reset view" relationship="label"><Button size="small" appearance="subtle" onClick={resetView}>Reset</Button></Tooltip>
            <Tooltip content="Fit" relationship="label"><Button size="small" appearance="subtle" onClick={fitView}>Fit</Button></Tooltip>
            <Tooltip content={expanded ? 'Restore' : 'Expand'} relationship="label"><Button size="small" appearance="subtle" onClick={toggleExpand}>{expanded ? '▢' : '⬜'}</Button></Tooltip>
            <Tooltip content={minimized ? 'Restore' : 'Minimise'} relationship="label"><Button size="small" appearance="subtle" onClick={toggleMinimize}>{minimized ? '🗗' : '–'}</Button></Tooltip>
            {onClose && <Tooltip content="Close" relationship="label"><Button size="small" appearance="subtle" onClick={onClose}>✕</Button></Tooltip>}
          </div>
        </div>
        <div className={styles.controlsRow}>
          <RadioGroup value={direction} onChange={(_, data) => setDirection(data.value)}>
            <Radio label="Out" value="out" />
            <Radio label="In" value="in" />
          </RadioGroup>
          <Checkbox label="Focus" checked={focusActive} onChange={(_,d)=>setFocusActive(d.checked)} size="small" />
          <Input placeholder="Filter..." value={filter} onChange={e=>setFilter(e.target.value)} size="small" style={{ flex: 1, minWidth: 0 }} />
        </div>
        <div className={styles.svgWrapper} onWheel={handleWheel}>
          <div className={styles.miniToolbar}>
            <Tooltip content="Zoom out" relationship="label"><Button size="small" onClick={()=>setZoom(z=>Math.max(0.35, z-0.15))}>-</Button></Tooltip>
            <Tooltip content="Zoom in" relationship="label"><Button size="small" onClick={()=>setZoom(z=>Math.min(3, z+0.15))}>+</Button></Tooltip>
          </div>
          <svg ref={svgRef} className={styles.canvas} style={{ cursor: dragging.current || panning.current ? 'grabbing' : 'grab' }} data-dragtick={dragTick}>
            <g transform={`translate(${pan.x + (wrapperRef.current?.clientWidth||0)/2}, ${pan.y + (wrapperRef.current?.clientHeight||0)/2}) scale(${zoom})`} data-dragtick={dragTick}>
              {links.map((l, i) => {
                const a = nodes.find(n => n.id === l.from);
                const b = nodes.find(n => n.id === l.to);
                if (!a || !b) return null;
                const dim = activeSet && !activeSet.has(a.id) && !activeSet.has(b.id);
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={dim ? tokens.colorNeutralStroke3 : tokens.colorNeutralStroke1} strokeWidth={dim ? 1 : 1.4} markerEnd="url(#arrowhead)" opacity={dim ? 0.3 : 0.85} />
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill={tokens.colorNeutralStroke1} />
                </marker>
              </defs>
              {nodes.map(n => {
                const isActive = n.id === activeNoteId;
                const dim = activeSet && !activeSet.has(n.id);
                const r = isActive ? 14 : 9 + Math.min(n.degree, 6) * 0.45;
                return (
                  <g key={n.id}
                     onClick={() => handleNodeClick(n.id)}
                     onDoubleClick={() => handleNodeDoubleClick(n.id)}
                     style={{ cursor: 'pointer' }}>
                    <circle data-id={n.id} cx={n.x} cy={n.y} r={r} fill={isActive ? tokens.colorBrandBackgroundStatic : tokens.colorNeutralBackground3} stroke={isActive ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke1} strokeWidth={isActive ? 3 : 1.6} opacity={dim ? 0.3 : 1} />
                    {!dim && (
                      <text x={n.x + r + 4} y={n.y + 3} className={styles.nodeLabel}>{n.title.slice(0, 30)}</text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
  {/* (Inner) legacy resize handles removed; outer handles now on wrapper */}
        {!expanded && !minimized && isResizing && (
          <div className={styles.sizeIndicator}>{Math.round(size.w)} × {Math.round(size.h)}</div>
        )}
  <Text className={styles.legend}>Drag header to move • Drag window borders or corners to resize • Scroll / +/- to zoom • Click select • Double-click open</Text>
        <div className={styles.metricsBar}>
          <span>{nodes.length} nodes</span>
          <span>{links.length} links</span>
          {activeNoteId && <span>deg {(graph[activeNoteId]?.mentions.length || 0) + (graph[activeNoteId]?.backlinks.length || 0)}</span>}
        </div>
      </Card>
      {/* Outer resize regions positioned relative to wrapper for true window edges */}
      {!expanded && !minimized && (
        <>
          <div className={`${styles.outerResizeBase} ${styles.outerTop}`} onMouseDown={(e)=>startResize(e,'t')} />
          <div className={`${styles.outerResizeBase} ${styles.outerBottom}`} onMouseDown={(e)=>startResize(e,'b')} />
          <div className={`${styles.outerResizeBase} ${styles.outerLeft}`} onMouseDown={(e)=>startResize(e,'l')} />
          <div className={`${styles.outerResizeBase} ${styles.outerRight}`} onMouseDown={(e)=>startResize(e,'r')} />
          <div className={`${styles.outerResizeBase} ${styles.outerTL}`} onMouseDown={(e)=>startResize(e,'tl')} />
          <div className={`${styles.outerResizeBase} ${styles.outerTR}`} onMouseDown={(e)=>startResize(e,'tr')} />
          <div className={`${styles.outerResizeBase} ${styles.outerBL}`} onMouseDown={(e)=>startResize(e,'bl')} />
          <div className={`${styles.outerResizeBase} ${styles.outerBR}`} onMouseDown={(e)=>startResize(e,'br')} />
        </>
      )}
      </div>
    </>
  );
};

export default LinkGraph;
