'use client'

import { useState } from 'react'
import { useShepKitStore } from '@/lib/store'
import { ProjectManager } from './ProjectManager'
import { 
  File, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Download,
  Upload
} from 'lucide-react'

export function FileExplorer() {
  const { 
    activeProject, 
    activeFile, 
    setActiveFile, 
    addFile, 
    deleteFile 
  } = useShepKitStore()
  
  const [newFileName, setNewFileName] = useState('')
  const [showNewFile, setShowNewFile] = useState(false)

  const handleCreateFile = () => {
    if (!newFileName.trim()) return
    
    addFile({
      name: newFileName.endsWith('.shep') ? newFileName : `${newFileName}.shep`,
      content: `component ${newFileName.replace('.shep', '')} {\n  "New Component"\n}`,
      path: `/${newFileName}`
    })
    
    setNewFileName('')
    setShowNewFile(false)
  }

  const handleDeleteFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation()
    if (confirm('Delete this file?')) {
      deleteFile(fileId)
    }
  }

  if (!activeProject) {
    return (
      <div className="h-full">
        <ProjectManager />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{activeProject.name}</span>
          <button
            onClick={() => setShowNewFile(!showNewFile)}
            className="text-muted-foreground hover:text-foreground"
            title="New File"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {showNewFile && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              placeholder="filename.shep"
              className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
              autoFocus
            />
            <button
              onClick={handleCreateFile}
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Create
            </button>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {activeProject.files.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No files yet</p>
          </div>
        ) : (
          <div className="py-2">
            {activeProject.files.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveFile(file)}
                className={`
                  flex items-center justify-between px-4 py-2 cursor-pointer
                  hover:bg-accent transition-colors group
                  ${activeFile?.id === file.id ? 'bg-accent' : ''}
                `}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteFile(e, file.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="border-t border-border p-2 flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          title="Import"
        >
          <Upload className="h-3.5 w-3.5" />
          Import
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          title="Export"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
    </div>
  )
}
