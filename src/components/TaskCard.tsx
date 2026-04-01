import { Draggable } from '@hello-pangea/dnd';
import type { TaskWithLabels } from '../types/tasks';
import { PRIORITY_CONFIG } from '../types/tasks';
import { theme } from '../theme';
import { getDueDateStatus, formatDueDate } from '../utils/dates';
import type { TeamMember } from '../hooks/useTeam';

interface TaskCardProps {
  task: TaskWithLabels;
  index: number;
  onClick: () => void;
  teamMembers: TeamMember[];
}

export function TaskCard({ task, index, onClick, teamMembers }: TaskCardProps) {
  const priorityInfo = PRIORITY_CONFIG[task.priority];
  const dueDateStatus = getDueDateStatus(task.due_date);
  const assignee = task.assignee_id
    ? teamMembers.find((m) => m.id === task.assignee_id)
    : null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{
            padding: '0.75rem',
            paddingLeft: '1rem',
            marginBottom: '0.5rem',
            backgroundColor: snapshot.isDragging
              ? theme.colors.cardHover
              : theme.colors.card,
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.borderLight}`,
            borderLeft: `4px solid ${priorityInfo.color}`,
            boxShadow: snapshot.isDragging
              ? theme.shadow.cardDragging
              : theme.shadow.card,
            cursor: 'grab',
            transition: 'box-shadow 0.2s ease, background-color 0.15s ease',
            fontFamily: theme.font.family,
            ...provided.draggableProps.style,
          }}
        >
          {/* Priority badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.375rem',
          }}>
            <span style={{
              fontSize: theme.font.size.xs,
              fontWeight: theme.font.weight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: priorityInfo.color,
              backgroundColor: `${priorityInfo.color}14`,
              padding: '0.1rem 0.4rem',
              borderRadius: theme.radius.sm,
            }}>
              P{task.priority} · {priorityInfo.label}
            </span>

            {dueDateStatus === 'overdue' && <span title="Overdue" style={{ fontSize: '0.85rem' }}>🔴</span>}
            {dueDateStatus === 'due-soon' && <span title="Due soon" style={{ fontSize: '0.85rem' }}>🟠</span>}
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
              marginBottom: '0.375rem',
            }}>
              {task.labels.map((label) => (
                <span
                  key={label.id}
                  style={{
                    fontSize: theme.font.size.xs,
                    fontWeight: theme.font.weight.medium,
                    fontFamily: theme.font.family,
                    color: label.color,
                    backgroundColor: `${label.color}18`,
                    padding: '0.05rem 0.35rem',
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${label.color}30`,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <p style={{
            fontSize: theme.font.size.base,
            fontWeight: theme.font.weight.medium,
            color: theme.colors.textPrimary,
            lineHeight: 1.4,
            marginBottom: task.due_date || task.description ? '0.4rem' : 0,
          }}>
            {task.title}
          </p>

          {/* Description preview */}
          {task.description && (
            <p style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
              lineHeight: 1.3,
              marginBottom: task.due_date ? '0.4rem' : 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {task.description}
            </p>
          )}

          {/* Due date */}
          {task.due_date && (
            <span style={{
              fontSize: theme.font.size.xs,
              fontWeight: theme.font.weight.medium,
              color: dueDateStatus === 'overdue'
                ? theme.colors.error
                : dueDateStatus === 'due-soon'
                  ? '#ea580c'
                  : theme.colors.textMuted,
            }}>
              📅 {formatDueDate(task.due_date)}
            </span>
          )}

          {/* Assignee avatar */}
          {assignee && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '0.4rem',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: assignee.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: '#fff',
                fontWeight: 700,
              }}>
                {assignee.name.charAt(0).toUpperCase()}
              </div>
              <span style={{
                fontSize: theme.font.size.xs,
                color: theme.colors.textMuted,
              }}>
                {assignee.name}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}