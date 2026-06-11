import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Edit3, Trash2, X, CheckSquare, Square } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Notes({ notes, onAddNote, onEditNote, onDeleteNote }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [preselectedDate, setPreselectedDate] = useState(null);

  // Modal state
  const [noteDate, setNoteDate] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  const openNew = (date = null) => {
    setEditingNote(null);
    setNoteDate(date || new Date().toISOString().split('T')[0]);
    setNoteContent('');
    setChecklist([]);
    setNewCheckItem('');
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setNoteDate(note.date);
    setNoteContent(note.content);
    setChecklist([...note.checklist]);
    setNewCheckItem('');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!noteContent.trim()) return;
    onAddNote({ date: noteDate, content: noteContent.trim(), checklist });
    setModalOpen(false);
  };

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist([...checklist, { id: uuidv4(), text: newCheckItem.trim(), completed: false }]);
    setNewCheckItem('');
  };

  const toggleCheckItem = (id) => {
    setChecklist(checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeCheckItem = (id) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section style={{ marginTop: '32px' }} id="notes-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StickyNote size={16} style={{ color: 'var(--accent-primary)' }} />
            <span className="section-label" style={{ marginBottom: 0 }}>Daily Notes</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-btn"
            onClick={() => openNew()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}
            id="add-note-btn"
          >
            <Plus size={14} />
            Add Note
          </motion.button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {sorted.map((note, idx) => (
            <motion.div
              key={note.id}
              className="glass-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              style={{ padding: '16px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {note.date}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEdit(note)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Edit3 size={13} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteNote(note.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: note.checklist.length > 0 ? '10px' : 0 }}>
                {note.content}
              </p>

              {/* Checklist preview */}
              {note.checklist.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                  {note.checklist.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: item.completed ? 'var(--success)' : 'var(--text-muted)', marginBottom: '4px' }}>
                      {item.completed ? <CheckSquare size={12} /> : <Square size={12} />}
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Note Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>
                  {editingNote ? 'Edit Note' : 'New Note'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Date */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date</label>
                <input
                  type="date"
                  className="custom-input"
                  value={noteDate}
                  onChange={(e) => setNoteDate(e.target.value)}
                />
              </div>

              {/* Content */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Content</label>
                <textarea
                  className="custom-textarea"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="What did you work on today?"
                />
              </div>

              {/* Checklist */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Checklist</label>
                {checklist.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <button
                      onClick={() => toggleCheckItem(item.id)}
                      style={{ background: 'transparent', border: 'none', color: item.completed ? 'var(--success)' : 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      {item.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                    <span style={{ flex: 1, fontSize: '13px', textDecoration: item.completed ? 'line-through' : 'none', color: 'var(--text-secondary)' }}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => removeCheckItem(item.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="custom-input"
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCheckItem()}
                    placeholder="Add checklist item..."
                    style={{ flex: 1, fontSize: '13px' }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addCheckItem}
                    className="glow-btn"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Save */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glow-btn"
                onClick={handleSave}
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              >
                {editingNote ? 'Update Note' : 'Save Note'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Expose openNew for external calls (e.g., from heatmap click)
Notes.openNew = null; // Will be set via ref pattern in App
