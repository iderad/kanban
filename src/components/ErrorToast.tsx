import { theme } from '../theme';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorToast({ message, onDismiss, onRetry }: ErrorToastProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      backgroundColor: theme.colors.errorBg,
      border: `1px solid ${theme.colors.errorBorder}`,
      borderRadius: theme.radius.md,
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 100,
      fontFamily: theme.font.family,
      boxShadow: theme.shadow.modal,
      maxWidth: '400px',
    }}>
      {/* Error icon */}
      <span style={{ fontSize: '1.2rem' }}>⚠️</span>

      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: theme.font.size.sm,
          color: theme.colors.error,
          fontWeight: theme.font.weight.medium,
        }}>
          {message}
        </p>
      </div>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.3rem 0.6rem',
            fontSize: theme.font.size.xs,
            fontFamily: theme.font.family,
            fontWeight: theme.font.weight.semibold,
            backgroundColor: theme.colors.error,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: theme.colors.error,
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0 0.25rem',
        }}
      >
        ✕
      </button>
    </div>
  );
}