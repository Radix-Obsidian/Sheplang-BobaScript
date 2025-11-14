/**
 * Explain Service for ShepYard
 * 
 * Generates human-readable explanations of ShepLang code
 * using static analysis of the canonical AST.
 * 
 * Phase 3: Explain Panel (Non-AI)
 */

export interface ExplainResult {
  appName: string;
  summary: string;
  components: ComponentInfo[];
  routes: RouteInfo[];
  dataModels: DataModelInfo[];
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface ComponentInfo {
  name: string;
  description: string;
}

export interface RouteInfo {
  path: string;
  component: string;
  description: string;
}

export interface DataModelInfo {
  name: string;
  fieldCount: number;
  description: string;
}

/**
 * Analyzes a canonical AST and generates human-readable explanation
 * 
 * @param canonicalAst - The canonical AST from transpiler
 * @returns ExplainResult with app analysis
 */
export function explainShepLangApp(canonicalAst: any): ExplainResult {
  if (!canonicalAst || !canonicalAst.body) {
    return {
      appName: 'Unknown App',
      summary: 'No application structure found.',
      components: [],
      routes: [],
      dataModels: [],
      complexity: 'simple',
    };
  }

  const appName = canonicalAst.name || 'My App';
  const components: ComponentInfo[] = [];
  const routes: RouteInfo[] = [];
  const dataModels: DataModelInfo[] = [];

  // Analyze AST body
  for (const node of canonicalAst.body) {
    if (node.type === 'ComponentDecl') {
      components.push({
        name: node.name,
        description: generateComponentDescription(node.name),
      });
    } else if (node.type === 'RouteDecl') {
      routes.push({
        path: node.path,
        component: node.target || node.component || 'Unknown',
        description: generateRouteDescription(node.path, node.target),
      });
    } else if (node.type === 'StateDecl') {
      const fieldCount = node.fields?.length || 0;
      dataModels.push({
        name: node.name,
        fieldCount,
        description: generateDataModelDescription(node.name, fieldCount),
      });
    }
  }

  // Generate summary
  const summary = generateSummary(appName, components.length, routes.length, dataModels.length);

  // Determine complexity
  const complexity = determineComplexity(components.length, routes.length, dataModels.length);

  return {
    appName,
    summary,
    components,
    routes,
    dataModels,
    complexity,
  };
}

/**
 * Generates a friendly summary of the app
 */
function generateSummary(
  appName: string,
  componentCount: number,
  routeCount: number,
  dataModelCount: number
): string {
  const parts: string[] = [];

  // App name
  parts.push(`**${appName}** is a`);

  // Complexity indicator
  if (componentCount === 0 && dataModelCount === 0) {
    return `**${appName}** is an empty application template.`;
  }

  // Components
  if (componentCount === 1) {
    parts.push('single-page app with 1 view');
  } else if (componentCount > 1) {
    parts.push(`multi-page app with ${componentCount} views`);
  }

  // Data models
  if (dataModelCount > 0) {
    if (dataModelCount === 1) {
      parts.push('that manages 1 data model');
    } else {
      parts.push(`that manages ${dataModelCount} data models`);
    }
  }

  // Routes
  if (routeCount > 0) {
    if (routeCount === 1) {
      parts.push('with 1 route');
    } else {
      parts.push(`with ${routeCount} routes`);
    }
  }

  return parts.join(' ') + '.';
}

/**
 * Generates a description for a component/view
 */
function generateComponentDescription(componentName: string): string {
  // Generate contextual description based on common naming patterns
  const name = componentName.toLowerCase();

  if (name.includes('dashboard') || name.includes('home')) {
    return 'Main landing view of the application';
  } else if (name.includes('list') || name.includes('index')) {
    return 'Displays a list of items';
  } else if (name.includes('detail') || name.includes('show') || name.includes('view')) {
    return 'Shows detailed information about a single item';
  } else if (name.includes('create') || name.includes('new') || name.includes('add')) {
    return 'Form for creating new items';
  } else if (name.includes('edit') || name.includes('update')) {
    return 'Form for editing existing items';
  } else if (name.includes('delete') || name.includes('remove')) {
    return 'Confirmation or action for deleting items';
  } else if (name.includes('settings') || name.includes('config')) {
    return 'Application configuration view';
  } else if (name.includes('profile') || name.includes('account')) {
    return 'User profile or account management';
  } else if (name.includes('about') || name.includes('info')) {
    return 'Information about the application';
  } else {
    return `The ${componentName} view`;
  }
}

/**
 * Generates a description for a route
 */
function generateRouteDescription(path: string, component: string): string {
  return `Navigates to ${component} when user visits ${path}`;
}

/**
 * Generates a description for a data model
 */
function generateDataModelDescription(modelName: string, fieldCount: number): string {
  if (fieldCount === 0) {
    return `${modelName} data structure (no fields defined yet)`;
  } else if (fieldCount === 1) {
    return `${modelName} with 1 field`;
  } else {
    return `${modelName} with ${fieldCount} fields`;
  }
}

/**
 * Determines app complexity based on counts
 */
function determineComplexity(
  componentCount: number,
  routeCount: number,
  dataModelCount: number
): 'simple' | 'moderate' | 'complex' {
  const totalItems = componentCount + routeCount + dataModelCount;

  if (totalItems <= 3) {
    return 'simple';
  } else if (totalItems <= 7) {
    return 'moderate';
  } else {
    return 'complex';
  }
}
