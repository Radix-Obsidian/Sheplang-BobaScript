/**
 * ShepYard Phase 3 Tests
 * 
 * Tests for explain panel and static analysis.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { explainShepLangApp } from '../services/explainService';
import { ExplainPanel } from '../ui/ExplainPanel';
import { CollapsiblePanel } from '../ui/CollapsiblePanel';

describe('ShepYard Phase 3: Explain Panel', () => {
  describe('Explain Service', () => {
    it('generates summary for simple app', () => {
      const mockAst = {
        name: 'MyApp',
        body: [
          { type: 'ComponentDecl', name: 'Dashboard' },
          { type: 'StateDecl', name: 'Todo' },
        ],
      };

      const result = explainShepLangApp(mockAst);

      expect(result.appName).toBe('MyApp');
      expect(result.components).toHaveLength(1);
      expect(result.dataModels).toHaveLength(1);
      expect(result.complexity).toBe('simple');
      expect(result.summary).toContain('MyApp');
    });

    it('identifies route information', () => {
      const mockAst = {
        name: 'TodoApp',
        body: [
          { type: 'RouteDecl', path: '/todos', target: 'TodoList' },
          { type: 'RouteDecl', path: '/create', target: 'CreateTodo' },
        ],
      };

      const result = explainShepLangApp(mockAst);

      expect(result.routes).toHaveLength(2);
      expect(result.routes[0].path).toBe('/todos');
      expect(result.routes[0].component).toBe('TodoList');
    });

    it('analyzes data models with fields', () => {
      const mockAst = {
        name: 'BlogApp',
        body: [
          {
            type: 'StateDecl',
            name: 'Post',
            fields: [
              { name: 'title', type: 'text' },
              { name: 'content', type: 'text' },
            ],
          },
        ],
      };

      const result = explainShepLangApp(mockAst);

      expect(result.dataModels).toHaveLength(1);
      expect(result.dataModels[0].name).toBe('Post');
      expect(result.dataModels[0].fieldCount).toBe(2);
    });

    it('determines complexity levels', () => {
      // Simple app (<=3 items)
      const simpleAst = {
        name: 'SimpleApp',
        body: [
          { type: 'ComponentDecl', name: 'Home' },
          { type: 'StateDecl', name: 'User' },
        ],
      };
      const simpleResult = explainShepLangApp(simpleAst);
      expect(simpleResult.complexity).toBe('simple');

      // Moderate app (4-7 items)
      const moderateAst = {
        name: 'ModerateApp',
        body: [
          { type: 'ComponentDecl', name: 'Dashboard' },
          { type: 'ComponentDecl', name: 'Settings' },
          { type: 'RouteDecl', path: '/', target: 'Dashboard' },
          { type: 'StateDecl', name: 'User' },
          { type: 'StateDecl', name: 'Post' },
        ],
      };
      const moderateResult = explainShepLangApp(moderateAst);
      expect(moderateResult.complexity).toBe('moderate');

      // Complex app (>7 items)
      const complexAst = {
        name: 'ComplexApp',
        body: [
          { type: 'ComponentDecl', name: 'Home' },
          { type: 'ComponentDecl', name: 'Dashboard' },
          { type: 'ComponentDecl', name: 'Settings' },
          { type: 'ComponentDecl', name: 'Profile' },
          { type: 'RouteDecl', path: '/', target: 'Home' },
          { type: 'RouteDecl', path: '/dashboard', target: 'Dashboard' },
          { type: 'StateDecl', name: 'User' },
          { type: 'StateDecl', name: 'Post' },
        ],
      };
      const complexResult = explainShepLangApp(complexAst);
      expect(complexResult.complexity).toBe('complex');
    });

    it('handles empty app gracefully', () => {
      const emptyAst = {
        name: 'EmptyApp',
        body: [],
      };

      const result = explainShepLangApp(emptyAst);

      expect(result.appName).toBe('EmptyApp');
      expect(result.components).toHaveLength(0);
      expect(result.routes).toHaveLength(0);
      expect(result.dataModels).toHaveLength(0);
    });
  });

  describe('ExplainPanel Component', () => {
    it('renders explain data when provided', () => {
      const mockExplainData = {
        appName: 'TestApp',
        summary: 'This is a test app with 2 views.',
        components: [
          { name: 'Dashboard', description: 'Main view' },
          { name: 'Settings', description: 'Settings view' },
        ],
        routes: [
          { path: '/', component: 'Dashboard', description: 'Home route' },
        ],
        dataModels: [
          { name: 'User', fieldCount: 3, description: 'User model with 3 fields' },
        ],
        complexity: 'simple' as const,
      };

      render(<ExplainPanel explainData={mockExplainData} />);

      expect(screen.getByText('This is a test app with 2 views.')).toBeInTheDocument();
      expect(screen.getAllByText('Dashboard')).toHaveLength(2); // Appears in views and routes
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText(/Views \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/Routes \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Data Models \(1\)/)).toBeInTheDocument();
    });

    it('shows empty state when no data', () => {
      render(<ExplainPanel explainData={null} />);

      expect(screen.getByText('Select an example to see its explanation')).toBeInTheDocument();
    });
  });

  describe('CollapsiblePanel Component', () => {
    it('renders with title and icon', () => {
      render(
        <CollapsiblePanel title="Test Panel" icon="🧪">
          <p>Test content</p>
        </CollapsiblePanel>
      );

      expect(screen.getByText('Test Panel')).toBeInTheDocument();
      expect(screen.getByText('🧪')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('is accessible with test id', () => {
      render(
        <CollapsiblePanel title="Test">
          <p>Content</p>
        </CollapsiblePanel>
      );

      expect(screen.getByTestId('collapsible-panel')).toBeInTheDocument();
    });
  });
});
