import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface ShepFile {
  id: string
  name: string
  content: string
  path: string
}

export interface ShepProject {
  id: string
  name: string
  files: ShepFile[]
  createdAt: string
  updatedAt: string
}

interface ShepKitState {
  // Project state
  projects: ShepProject[]
  activeProject: ShepProject | null
  activeFile: ShepFile | null
  
  // UI state
  showAI: boolean
  showPreview: boolean
  
  // Transpiled output
  transpiledCode: string
  transpileError: string | null
  ast: any | null
  
  // Actions
  setActiveProject: (project: ShepProject | null) => void
  setActiveFile: (file: ShepFile | null) => void
  updateFileContent: (fileId: string, content: string) => void
  addFile: (file: Omit<ShepFile, 'id'>) => void
  deleteFile: (fileId: string) => void
  toggleAI: () => void
  togglePreview: () => void
  setTranspiledCode: (code: string) => void
  setTranspileError: (error: string | null) => void
  setAST: (ast: any) => void
  loadProjects: (projects: ShepProject[]) => void
  addProject: (project: ShepProject) => void
}

export const useShepKitStore = create<ShepKitState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        projects: [],
        activeProject: null,
        activeFile: null,
        showAI: false,
        showPreview: true,
        transpiledCode: '',
        transpileError: null,
        ast: null,

        // Actions
        setActiveProject: (project) => set({ activeProject: project }),
        
        setActiveFile: (file) => set({ activeFile: file }),
        
        updateFileContent: (fileId, content) => {
          const { activeProject } = get()
          if (!activeProject) return
          
          const updatedFiles = activeProject.files.map(f =>
            f.id === fileId ? { ...f, content } : f
          )
          
          const updatedProject = {
            ...activeProject,
            files: updatedFiles,
            updatedAt: new Date().toISOString()
          }
          
          set({
            activeProject: updatedProject,
            activeFile: updatedFiles.find(f => f.id === fileId) || null
          })
        },
        
        addFile: (file) => {
          const { activeProject } = get()
          if (!activeProject) return
          
          const newFile: ShepFile = {
            ...file,
            id: `file_${Date.now()}`
          }
          
          const updatedProject = {
            ...activeProject,
            files: [...activeProject.files, newFile],
            updatedAt: new Date().toISOString()
          }
          
          set({ activeProject: updatedProject, activeFile: newFile })
        },
        
        deleteFile: (fileId) => {
          const { activeProject, activeFile } = get()
          if (!activeProject) return
          
          const updatedFiles = activeProject.files.filter(f => f.id !== fileId)
          const updatedProject = {
            ...activeProject,
            files: updatedFiles,
            updatedAt: new Date().toISOString()
          }
          
          set({
            activeProject: updatedProject,
            activeFile: activeFile?.id === fileId ? null : activeFile
          })
        },
        
        toggleAI: () => set(state => ({ showAI: !state.showAI })),
        
        togglePreview: () => set(state => ({ showPreview: !state.showPreview })),
        
        setTranspiledCode: (code) => set({ transpiledCode: code }),
        
        setTranspileError: (error) => set({ transpileError: error }),
        
        setAST: (ast) => set({ ast }),
        
        loadProjects: (projects) => set({ projects }),
        
        addProject: (project) => set(state => ({
          projects: [...state.projects, project],
          activeProject: project
        }))
      }),
      {
        name: 'shepkit-storage',
        partialize: (state) => ({
          projects: state.projects,
          activeProject: state.activeProject,
        })
      }
    ),
    { name: 'ShepKit Store' }
  )
)
