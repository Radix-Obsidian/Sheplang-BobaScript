'use client'

import { FileExplorer } from './components/FileExplorer'
import { MonacoEditor } from './components/MonacoEditor'
import { LivePreview } from './components/LivePreview'
import { AIAssistant } from './components/AIAssistant'
import { DeployButton } from './components/DeployButton'
import { useShepKitStore } from '@/lib/store'
import { Split, Code2, Bot, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ShepKitIDE() {
  const { activeFile, showAI, toggleAI } = useShepKitStore()
  const router = useRouter()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* File Explorer - Left Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Code2 className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">ShepKit Alpha</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <FileExplorer />
        </div>
        <div className="border-t border-border p-4">
          <DeployButton />
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <div className="flex items-center gap-2">
            <Split className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {activeFile?.name || 'No file selected'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAI}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                showAI
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Bot className="inline-block h-4 w-4 mr-1.5" />
              AI Assistant
            </button>
            <button 
              onClick={() => router.push('/settings')}
              className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Settings className="inline-block h-4 w-4 mr-1.5" />
              Settings
            </button>
          </div>
        </header>

        {/* Split View: Editor + Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor />
          </div>

          {/* Live Preview */}
          <div className="w-1/2 border-l border-border overflow-hidden">
            <LivePreview />
          </div>
        </div>
      </main>

      {/* AI Assistant - Right Sidebar (Conditional) */}
      {showAI && (
        <aside className="w-96 border-l border-border bg-card">
          <AIAssistant />
        </aside>
      )}
    </div>
  )
}
