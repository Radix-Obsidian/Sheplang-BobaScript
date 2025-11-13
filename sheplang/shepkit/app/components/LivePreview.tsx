'use client'

import { useState } from 'react'
import { useShepKitStore } from '@/lib/store'
import { Eye, Code, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react'

type PreviewTab = 'visual' | 'boba' | 'ast'

export function LivePreview() {
  const { transpiledCode, transpileError, ast } = useShepKitStore()
  const [activeTab, setActiveTab] = useState<PreviewTab>('visual')

  const findTitle = (astData: any): string | null => {
    const queue = [...(astData?.body ?? [])]
    while (queue.length) {
      const node = queue.shift()
      if (node?.type === 'Text' && typeof node.value === 'string') return node.value
      if (Array.isArray(node?.children)) queue.push(...node.children)
      if (Array.isArray(node?.body)) queue.push(...node.body)
    }
    return null
  }

  const findAppName = (astData: any): string | null => {
    const node = (astData?.body ?? []).find((x: any) => x?.type === 'ComponentDecl')
    return node?.name ?? null
  }

  const renderVisualPreview = () => {
    if (transpileError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Transpile Error</h3>
          <p className="text-sm text-muted-foreground max-w-md">{transpileError}</p>
        </div>
      )
    }

    if (!ast) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
          <Eye className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Write some ShepLang code to see the preview</p>
        </div>
      )
    }

    const title = findTitle(ast) ?? findAppName(ast) ?? 'Preview'

    return (
      <div className="h-full p-8 bg-gradient-to-br from-background to-secondary/20">
        <div className="max-w-2xl mx-auto">
          {/* Visual Preview Card */}
          <div className="bg-card border border-border rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Compiled successfully</span>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
            
            {ast.body?.map((node: any, idx: number) => {
              if (node.type === 'ComponentDecl') {
                return (
                  <div key={idx} className="mb-4 p-4 bg-secondary/30 rounded border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-mono text-sm text-foreground">Component: {node.name}</span>
                    </div>
                    {node.stateDecls?.length > 0 && (
                      <div className="ml-4 text-xs text-muted-foreground">
                        State: {node.stateDecls.map((s: any) => s.name).join(', ')}
                      </div>
                    )}
                  </div>
                )
              }
              if (node.type === 'RouteDecl') {
                return (
                  <div key={idx} className="mb-2 p-3 bg-accent rounded border border-border">
                    <span className="font-mono text-sm text-foreground">
                      Route: {node.path} → {node.component}
                    </span>
                  </div>
                )
              }
              if (node.type === 'ActionDecl') {
                return (
                  <div key={idx} className="mb-2 p-3 bg-muted rounded border border-border">
                    <span className="font-mono text-sm text-foreground">
                      Action: {node.name}({node.params?.join(', ') ?? ''})
                    </span>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'visual'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="h-4 w-4" />
          Visual
        </button>
        <button
          onClick={() => setActiveTab('boba')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'boba'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code className="h-4 w-4" />
          BobaScript
        </button>
        <button
          onClick={() => setActiveTab('ast')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'ast'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileJson className="h-4 w-4" />
          AST
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'visual' && renderVisualPreview()}
        
        {activeTab === 'boba' && (
          <pre className="h-full p-4 bg-[#1e1e1e] text-gray-300 text-sm font-mono overflow-auto">
            {transpileError ? (
              <span className="text-red-400">{transpileError}</span>
            ) : transpiledCode || '// No output yet'}
          </pre>
        )}
        
        {activeTab === 'ast' && (
          <pre className="h-full p-4 bg-[#1e1e1e] text-gray-300 text-sm font-mono overflow-auto">
            {transpileError ? (
              <span className="text-red-400">{transpileError}</span>
            ) : JSON.stringify(ast, null, 2) || '// No AST yet'}
          </pre>
        )}
      </div>
    </div>
  )
}
