import { theme } from '../theme';
import type { Priority, Label } from '../types/tasks';

interface BoardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
  labelFilter: string | 'all'; // label id or 'all'
  onLabelChange: (labelId: string | 'all') => void;
  labels: Label[];
}

export function BoardFilters({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  labelFilter,
  onLabelChange,
  labels,
}: BoardFiltersProps) {
  const selectStyle = {
    padding: '0.4rem 0.6rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
    fontFamily: theme.font.family,
    fontSize: theme.font.size.sm,
    outline: 'none',
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1.5rem',
      borderBottom: `1px solid ${theme.colors.borderLight}`,
      backgroundColor: theme.colors.card,
      flexWrap: 'wrap',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
        <span style={{
          position: 'absolute',
          left: '0.6rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: theme.colors.textMuted,
          fontSize: '0.85rem',
        }}>
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          style={{
            ...selectStyle,
            width: '100%',
            paddingLeft: '2rem',
          }}
        />
      </div>

      {/* Priority filter */}
      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
        style={selectStyle}
      >
        <option value="all">All Priorities</option>
        <option value="1">P1 · Critical</option>
        <option value="2">P2 · High</option>
        <option value="3">P3 · Medium</option>
        <option value="4">P4 · Low</option>
        <option value="5">P5 · Minimal</option>
      </select>

      {/* Label filter */}
      {labels.length > 0 && (
        <select
          value={labelFilter}
          onChange={(e) => onLabelChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Labels</option>
          {labels.map((label) => (
            <option key={label.id} value={label.id}>
              {label.name}
            </option>
          ))}
        </select>
      )}

      {/* Clear filters */}
      {(searchQuery || priorityFilter !== 'all' || labelFilter !== 'all') && (
        <button
          onClick={() => {
            onSearchChange('');
            onPriorityChange('all');
            onLabelChange('all');
          }}
          style={{
            padding: '0.4rem 0.6rem',
            border: 'none',
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.accentLight,
            color: theme.colors.accent,
            fontFamily: theme.font.family,
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.semibold,
            cursor: 'pointer',
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}   