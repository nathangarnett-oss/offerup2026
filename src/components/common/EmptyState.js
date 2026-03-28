import { SearchX } from 'lucide-react';

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your filters or search terms.',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm">
        {description}
      </p>
      {action && actionLabel && (
        <button onClick={action} className="btn-primary mt-6 text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
