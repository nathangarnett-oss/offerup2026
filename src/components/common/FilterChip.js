import { X } from 'lucide-react';

export default function FilterChip({ label, active = false, onClick, onRemove }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${
                    active
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/25 hover:bg-primary-700'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
    >
      <span>{label}</span>
      {active && onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  );
}
