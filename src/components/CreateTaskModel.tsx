import { useState } from 'react';
import { PRIORITY_CONFIG, type Priority } from '../types/tasks.ts';
import { theme } from '../theme';

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
  const [priority, setPriority] = useState<Priority>('3');
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

    setTitle('');
    setDescription('');
    setPriority('3');
    setDueDate('');
    setSubmitting(false);
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    marginTop: '0.25rem',
    fontSize: theme.font.size.base,
    fontFamily: theme.font.family,
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(45, 36, 24, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.colors.bg,
          borderRadius: theme.radius.xl,
          padding: '1.5rem',
          width: '100%',
          maxWidth: '480px',
          margin: '1rem',
          boxShadow: theme.shadow.modal,
          border: `1px solid ${theme.colors.border}`,
          fontFamily: theme.font.family,
        }}
      >
        <h2 style={{
          fontSize: theme.font.size.lg,
          fontWeight: theme.font.weight.bold,
          color: theme.colors.textPrimary,
          marginBottom: '1.25rem',
        }}>
          Create New Task
        </h2>

        {/* Title */}
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <span style={{
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.textSecondary,
          }}>
            Title *
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            style={inputStyle}
          />
        </label>

        {/* Description */}
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <span style={{
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.textSecondary,
          }}>
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more detail..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' as const }}
          />
        </label>

        {/* Priority selector — visual buttons */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.textSecondary,
            display: 'block',
            marginBottom: '0.4rem',
          }}>
            Priority
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['1', '2', '3', '4', '5'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  border: priority === p
                    ? `2px solid ${PRIORITY_CONFIG[p].color}`
                    : `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  backgroundColor: priority === p
                    ? `${PRIORITY_CONFIG[p].color}18`
                    : theme.colors.card,
                  cursor: 'pointer',
                  fontFamily: theme.font.family,
                  fontSize: theme.font.size.xs,
                  fontWeight: theme.font.weight.semibold,
                  color: priority === p
                    ? PRIORITY_CONFIG[p].color
                    : theme.colors.textMuted,
                  transition: 'all 0.15s ease',
                }}
              >
                P{p}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <label style={{ display: 'block', marginBottom: '1.5rem' }}>
          <span style={{
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.textSecondary,
          }}>
            Due Date
          </span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={inputStyle}
          />
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: 'transparent',
              color: theme.colors.textSecondary,
              cursor: 'pointer',
              fontFamily: theme.font.family,
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.medium,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || submitting}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: theme.radius.md,
              border: 'none',
              backgroundColor: title.trim()
                ? theme.colors.accent
                : theme.colors.border,
              color: '#fff',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              fontFamily: theme.font.family,
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              transition: 'background-color 0.15s ease',
            }}
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}