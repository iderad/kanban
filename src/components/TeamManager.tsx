import { useState } from 'react';
import { theme } from '../theme';
import { DEFAULT_LABEL_COLORS } from '../types/tasks';
import type { TeamMember } from '../hooks/useTeam';

interface TeamManagerProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onAddMember: (name: string, color: string) => Promise<any>;
  onRemoveMember: (memberId: string) => Promise<void>;
}

export function TeamManager({ isOpen, onClose, members, onAddMember, onRemoveMember }: TeamManagerProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_LABEL_COLORS[4]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!name.trim()) return;
    await onAddMember(name.trim(), color);
    setName('');
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
          maxWidth: '420px',
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
          Team Members
        </h2>

        {/* Add new member */}
        <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.5rem',
        }}>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Member name"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                fontSize: theme.font.size.base,
                fontFamily: theme.font.family,
                backgroundColor: theme.colors.card,
                color: theme.colors.textPrimary,
                outline: 'none',
            }}
            />
            <button
            onClick={handleAdd}
            disabled={!name.trim()}
            style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: name.trim() ? theme.colors.accent : theme.colors.border,
                color: '#fff',
                border: 'none',
                borderRadius: theme.radius.md,
                fontFamily: theme.font.family,
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.semibold,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
            }}
            >
            Add
            </button>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span style={{
            fontSize: theme.font.size.xs,
            color: theme.colors.textMuted,
            marginRight: '0.25rem',
            }}>
            Color:
            </span>
            {DEFAULT_LABEL_COLORS.slice(0, 6).map((c) => (
            <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: c,
                border: color === c ? '2px solid #2D2418' : '2px solid transparent',
                cursor: 'pointer',
                }}
            />
            ))}
        </div>
        </div>

        {/* Member list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {members.length === 0 && (
            <p style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textMuted,
              textAlign: 'center',
              padding: '1rem 0',
            }}>
              No team members yet — add someone above
            </p>
          )}

          {members.map((member) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.md,
                border: `1px solid ${theme.colors.borderLight}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Avatar */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: member.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  color: '#fff',
                  fontWeight: 700,
                }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.medium,
                  color: theme.colors.textPrimary,
                }}>
                  {member.name}
                </span>
              </div>

              {/* Delete */}
              {confirmDeleteId === member.id ? (
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    onClick={() => { onRemoveMember(member.id); setConfirmDeleteId(null); }}
                    style={{
                      padding: '0.2rem 0.5rem',
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
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    style={{
                      padding: '0.2rem 0.5rem',
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
                  onClick={() => setConfirmDeleteId(member.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.colors.textMuted,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '0.2rem',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              backgroundColor: 'transparent',
              color: theme.colors.textSecondary,
              fontFamily: theme.font.family,
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.medium,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}