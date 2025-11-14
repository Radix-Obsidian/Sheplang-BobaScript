/**
 * ExplainPanel Component
 * 
 * Non-AI teaching panel that explains ShepLang code in plain English.
 * Uses static analysis only (no AI/LLM).
 * 
 * Phase 3: Explain Panel
 */

import { useMemo } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';
import type { ExplainResult } from '../services/explainService';

interface ExplainPanelProps {
  explainData: ExplainResult | null;
  defaultOpen?: boolean;
}

/**
 * Displays human-readable explanation of ShepLang code
 * 
 * Shows:
 * - App summary
 * - Components/views list
 * - Routes/navigation
 * - Data models
 * - Complexity badge
 */
export function ExplainPanel({ explainData, defaultOpen = false }: ExplainPanelProps) {
  // Memoize complexity badge rendering
  const complexityBadge = useMemo(() => {
    if (!explainData) return null;

    const colors = {
      simple: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      complex: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[explainData.complexity]}`}>
        {explainData.complexity === 'simple' && '🟢 Simple'}
        {explainData.complexity === 'moderate' && '🟡 Moderate'}
        {explainData.complexity === 'complex' && '🟠 Complex'}
      </span>
    );
  }, [explainData]);

  if (!explainData) {
    return (
      <CollapsiblePanel
        title="Explain"
        icon="💡"
        defaultOpen={defaultOpen}
      >
        <div className="text-gray-500 text-center py-8">
          <p>Select an example to see its explanation</p>
        </div>
      </CollapsiblePanel>
    );
  }

  return (
    <CollapsiblePanel
      title="Explain"
      icon="💡"
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        {/* App Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">App Summary</h4>
            {complexityBadge}
          </div>
          <p className="text-gray-700 leading-relaxed">{explainData.summary}</p>
        </div>

        {/* Components/Views */}
        {explainData.components.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Views ({explainData.components.length})
            </h4>
            <ul className="space-y-2">
              {explainData.components.map((component, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                >
                  <span className="text-blue-600 font-mono text-sm flex-shrink-0">
                    {component.name}
                  </span>
                  <span className="text-gray-600 text-sm">—</span>
                  <span className="text-gray-700 text-sm">{component.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Routes */}
        {explainData.routes.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Routes ({explainData.routes.length})
            </h4>
            <ul className="space-y-2">
              {explainData.routes.map((route, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                >
                  <span className="text-purple-600 font-mono text-sm flex-shrink-0">
                    {route.path}
                  </span>
                  <span className="text-gray-600 text-sm">→</span>
                  <span className="text-gray-700 text-sm">{route.component}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Models */}
        {explainData.dataModels.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Data Models ({explainData.dataModels.length})
            </h4>
            <ul className="space-y-2">
              {explainData.dataModels.map((model, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                >
                  <span className="text-green-600 font-mono text-sm flex-shrink-0">
                    {model.name}
                  </span>
                  <span className="text-gray-600 text-sm">—</span>
                  <span className="text-gray-700 text-sm">{model.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty state */}
        {explainData.components.length === 0 &&
          explainData.routes.length === 0 &&
          explainData.dataModels.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              <p>This app doesn't have any components or data models yet.</p>
            </div>
          )}
      </div>
    </CollapsiblePanel>
  );
}
