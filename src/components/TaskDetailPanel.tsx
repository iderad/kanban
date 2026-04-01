import { useState } from 'react';
import { theme } from '../theme';
import { PRIORITY_CONFIG, DEFAULT_LABEL_COLORS } from '../types/tasks';
import type { TaskWithLabels, Priority, Label } from '../types/tasks';

interface TaskDetailPanelProps {
  task: TaskWithLabels;
  labels: Label[];
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<TaskWithLabels>) => void;
  onDelete: (taskId: string) => void;
  onAddLabel: (taskId: string, labelId: string) => Promise<boolean>;
  onRemoveLabel: (taskId: string, labelId: string) => Promise<boolean>;
  onCreateLabel: (name: string, color: string) => Promise<any>;
  onRefreshLabels: (taskId: string) => Promise<void>;
}

export function TaskDetailPanel({
  task,
  labels,
  onClose,
  onUpdate,
  onDelete,
  onAddLabel,
  onRemoveLabel,
  onCreateLabel,
  onRefreshLabels,
}: TaskDetailPanelProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [showLabelCreator, setShowLabelCreator] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(DEFAULT_LABEL_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      due_date: dueDate || null,
    });
    onClose();
  };

  const handleToggleLabel = async (label: Label) => {
    const hasLabel = task.labels.some((l) => l.id === label.id);
    if (hasLabel) {
      await onRemoveLabel(task.id, label.id);
    } else {
      await onAddLabel(task.id, label.id);
    }
    await onRefreshLabels(task.id);
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    await onCreateLabel(newLabelName.trim(), newLabelColor);
    setNewLabelName('');
    setShowLabelCreator(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.size.base,
    fontFamily: theme.font.family,
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(45, 36, 24, 0.3)',
          zIndex: 40,
        }}
      />

      {/* Slide-out panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '480px',
        backgroundColor: theme.colors.bg,
        borderLeft: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.modal,
        zIndex: 50,
        overflowY: 'auto',
        fontFamily: theme.font.family,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${theme.colors.borderLight}`,
        }}>
          <h2 style={{
            fontSize: theme.font.size.md,
            fontWeight: theme.font.weight.bold,
            color: theme.colors.textPrimary,
          }}>
            Task Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: theme.colors.textMuted,
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: '1.25rem', flex: 1 }}>
          {/* Title */}
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span style={{
              fontSize: theme.font.size.sm,
              fontWeight: theme.font.weight.semibold,
              color: theme.colors.textSecondary,
            }}>
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ ...inputStyle, marginTop: '0.25rem' }}
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
              placeholder="Add a description..."
              rows={4}
              style={{ ...inputStyle, marginTop: '0.25rem', resize: 'vertical' as const }}
            />
          </label>

          {/* Priority */}
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
                  }}
                >
                  P{p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
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
              style={{ ...inputStyle, marginTop: '0.25rem' }}
            />
          </label>

          {/* Labels section */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}>
              <span style={{
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.textSecondary,
              }}>
                Labels
              </span>
              <button
                onClick={() => setShowLabelCreator(!showLabelCreator)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.accent,
                  fontSize: theme.font.size.sm,
                  fontFamily: theme.font.family,
                  fontWeight: theme.font.weight.semibold,
                  cursor: 'pointer',
                }}
              >
                + New Label
              </button>
            </div>

            {/* Label creator */}
            {showLabelCreator && (
              <div style={{
                display: 'flex',
                gap: '0.4rem',
                marginBottom: '0.5rem',
                alignItems: 'center',
              }}>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Label name"
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateLabel()}
                />
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {DEFAULT_LABEL_COLORS.slice(0, 6).map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewLabelColor(color)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: newLabelColor === color
                          ? '2px solid #2D2418'
                          : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleCreateLabel}
                  style={{
                    padding: '0.35rem 0.6rem',
                    backgroundColor: theme.colors.accent,
                    color: '#fff',
                    border: 'none',
                    borderRadius: theme.radius.sm,
                    fontFamily: theme.font.family,
                    fontSize: theme.font.size.xs,
                    fontWeight: theme.font.weight.semibold,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            )}

            {/* Existing labels — toggle on/off */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {labels.map((label) => {
                const isActive = task.labels.some((l) => l.id === label.id);
                return (
                  <button
                    key={label.id}
                    onClick={() => handleToggleLabel(label)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: theme.radius.sm,
                      border: `1px solid ${label.color}${isActive ? '' : '40'}`,
                      backgroundColor: isActive ? `${label.color}20` : 'transparent',
                      color: isActive ? label.color : theme.colors.textMuted,
                      fontFamily: theme.font.family,
                      fontSize: theme.font.size.xs,
                      fontWeight: theme.font.weight.medium,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isActive ? '✓ ' : ''}{label.name}
                  </button>
                );
              })}
              {labels.length === 0 && !showLabelCreator && (
                <p style={{
                  fontSize: theme.font.size.xs,
                  color: theme.colors.textMuted,
                }}>
                  No labels yet — create one above
                </p>
              )}
            </div>
          </div>

          {/* Status display */}
          <div style={{
            padding: '0.6rem 0.75rem',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            marginBottom: '1.25rem',
          }}>
            <span style={{
              fontSize: theme.font.size.xs,
              color: theme.colors.textMuted,
            }}>
              Status: <strong style={{ color: theme.colors.textSecondary }}>
                {task.status.replace('_', ' ')}
              </strong>
            </span>
            <span style={{
              fontSize: theme.font.size.xs,
              color: theme.colors.textMuted,
              marginLeft: '1rem',
            }}>
              Created: {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: `1px solid ${theme.colors.borderLight}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {/* Delete */}
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{
                fontSize: theme.font.size.sm,
                color: theme.colors.error,
              }}>
                Are you sure?
              </span>
              <button
                onClick={() => { onDelete(task.id); onClose(); }}
                style={{
                  padding: '0.35rem 0.6rem',
                  backgroundColor: theme.colors.error,
                  color: '#fff',
                  border: 'none',
                  borderRadius: theme.radius.sm,
                  fontFamily: theme.font.family,
                  fontSize: theme.font.size.xs,
                  fontWeight: theme.font.weight.semibold,
                  cursor: 'pointer',
                }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: '0.35rem 0.6rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  backgroundColor: 'transparent',
                  fontFamily: theme.font.family,
                  fontSize: theme.font.size.xs,
                  cursor: 'pointer',
                  color: theme.colors.textSecondary,
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                padding: '0.4rem 0.75rem',
                border: `1px solid ${theme.colors.errorBorder}`,
                borderRadius: theme.radius.md,
                backgroundColor: 'transparent',
                color: theme.colors.error,
                fontFamily: theme.font.family,
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.medium,
                cursor: 'pointer',
              }}
            >
              Delete Task
            </button>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: title.trim() ? theme.colors.accent : theme.colors.border,
              color: '#fff',
              border: 'none',
              borderRadius: theme.radius.md,
              fontFamily: theme.font.family,
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              cursor: title.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}