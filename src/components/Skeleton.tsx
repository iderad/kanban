import { theme } from '../theme';
import { COLUMNS } from '../types/tasks.ts';

export function BoardSkeleton() {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1.5rem',
      overflowX: 'auto',
      height: 'calc(100vh - 72px)',
    }}>
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          style={{
            minWidth: '280px',
            width: '280px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: '0.75rem',
            border: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          {/* Column header skeleton */}
          <div style={{
            height: '14px',
            width: '80px',
            backgroundColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            marginBottom: '1rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />

          {/* Card skeletons — varying count per column */}
          {Array.from({ length: col.id === 'todo' ? 3 : 2 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.md,
                padding: '0.75rem',
                marginBottom: '0.5rem',
                border: `1px solid ${theme.colors.borderLight}`,
              }}
            >
              <div style={{
                height: '10px',
                width: '40px',
                backgroundColor: theme.colors.border,
                borderRadius: '4px',
                marginBottom: '0.5rem',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <div style={{
                height: '12px',
                width: `${60 + i * 15}%`,
                backgroundColor: theme.colors.border,
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}