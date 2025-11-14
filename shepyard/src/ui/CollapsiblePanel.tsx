/**
 * CollapsiblePanel Component
 * 
 * Accessible collapsible panel using HTML <details> element.
 * Based on MDN official documentation for details/summary elements.
 * 
 * References:
 * - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
 * - https://react.dev/learn/sharing-state-between-components
 * 
 * Phase 3: Explain Panel
 */

import { ReactNode } from 'react';

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children: ReactNode;
  icon?: string;
  className?: string;
}

/**
 * Accessible collapsible panel component
 * 
 * Uses native HTML <details> element for:
 * - Built-in accessibility (keyboard navigation, screen readers)
 * - No JavaScript required for basic functionality
 * - Semantic HTML structure
 * 
 * @example
 * ```tsx
 * <CollapsiblePanel title="Explain" icon="💡">
 *   <p>Panel content here</p>
 * </CollapsiblePanel>
 * ```
 */
export function CollapsiblePanel({
  title,
  defaultOpen = false,
  onToggle,
  children,
  icon,
  className = '',
}: CollapsiblePanelProps) {
  const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    const isOpen = event.currentTarget.open;
    onToggle?.(isOpen);
  };

  return (
    <details
      className={`collapsible-panel border-b border-gray-300 ${className}`}
      open={defaultOpen}
      onToggle={handleToggle}
      data-testid="collapsible-panel"
    >
      <summary className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer select-none transition-colors">
        {/* Icon */}
        {icon && <span className="text-xl">{icon}</span>}
        
        {/* Title */}
        <span className="font-semibold text-gray-800 flex-1">{title}</span>
        
        {/* Chevron indicator (rotates when open) */}
        <svg
          className="w-5 h-5 text-gray-600 transition-transform details-chevron"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </summary>

      {/* Panel content */}
      <div className="px-4 py-3 bg-white">
        {children}
      </div>

      {/* CSS for collapsible behavior */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Rotate chevron when details is open */
        details[open] .details-chevron {
          transform: rotate(180deg);
        }

        /* Remove default marker/triangle */
        summary {
          list-style: none;
        }
        
        summary::-webkit-details-marker {
          display: none;
        }

        /* Smooth transitions */
        .details-chevron {
          transition: transform 0.2s ease-in-out;
        }
      `}} />
    </details>
  );
}

/**
 * Collapsible Panel Group
 * 
 * Groups multiple panels with optional "accordion" behavior
 * (only one panel open at a time)
 */
interface CollapsiblePanelGroupProps {
  children: ReactNode;
  accordion?: boolean;
  className?: string;
}

export function CollapsiblePanelGroup({
  children,
  accordion = false,
  className = '',
}: CollapsiblePanelGroupProps) {
  return (
    <div
      className={`collapsible-panel-group ${className}`}
      data-accordion={accordion}
    >
      {children}
    </div>
  );
}
