import { useState } from 'react';
import type { Priority } from '../types/tasks.ts';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description: string | null;
    priority: Priority;
    due_date: string | null;
  }) => Promise<any>;
}

export function CreateTaskModal({ isOpen, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);

    await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      due_date: dueDate || null,
    });

    // Reset form and close
    setTitle('');
    setDescription('');
    setPriority('normal');
    setDueDate('');
    setSubmitting(false);
    onClose();
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      {/* Modal — stop click propagation so clicking inside doesn't close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '480px',
          margin: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
          Create New Task
        </h2>

        {/* Title — required */}
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>
            Title *
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              marginTop: '0.25rem',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </label>

        {/* Description */}
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more detail..."
            rows={3}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              marginTop: '0.25rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </label>

        {/* Priority and Due Date on the same row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>
              Priority
            </span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </label>

          <label style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>
              Due Date
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || submitting}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: title.trim() ? '#3b82f6' : '#93c5fd',
              color: '#fff',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}