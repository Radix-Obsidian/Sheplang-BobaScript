'use client'

import { useEffect, useRef } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { useShepKitStore } from '@/lib/store'
import { transpileShepToBoba } from '@adapters/sheplang-to-boba'
import { FileCode, AlertCircle } from 'lucide-react'

export function MonacoEditor() {
  const { 
    activeFile, 
    updateFileContent, 
    setTranspiledCode, 
    setTranspileError,
    setAST 
  } = useShepKitStore()
  
  const editorRef = useRef<any>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Register ShepLang language
    monaco.languages.register({ id: 'sheplang' })
    
    monaco.languages.setMonarchTokensProvider('sheplang', {
      tokenizer: {
        root: [
          [/\b(component|action|route|state|props)\b/, 'keyword'],
          [/\b(true|false|null)\b/, 'constant'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          [/\d+/, 'number'],
          [/[{}()\[\]]/, '@brackets'],
          [/->/, 'operator'],
          [/[a-zA-Z_]\w*/, 'identifier'],
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/"/, 'string', '@pop']
        ]
      }
    })

    monaco.languages.setLanguageConfiguration('sheplang', {
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' }
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' }
      ]
    })

    monaco.editor.defineTheme('shepkit-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'constant', foreground: '569CD6' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
      }
    })

    monaco.editor.setTheme('shepkit-dark')
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return

    updateFileContent(activeFile.id, value)

    // Debounce transpilation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await transpileShepToBoba(value)
        if (result.success && result.output) {
          setTranspiledCode(result.output)
          setAST(result.canonicalAst || null)
          setTranspileError(null)
        } else {
          const errorMsg = result.diagnostics
            .filter(d => d.severity === 'error')
            .map(d => d.message)
            .join('\n') || 'Transpilation failed'
          setTranspileError(errorMsg)
          setTranspiledCode('')
        }
      } catch (error: any) {
        setTranspileError(error?.message || String(error))
        setTranspiledCode('')
      }
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
        <FileCode className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-sm">Select a file to start editing</p>
        <p className="text-xs mt-2 text-gray-500">or create a new .shep file</p>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <Editor
        height="100%"
        language="sheplang"
        value={activeFile.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 }
        }}
      />
    </div>
  )
}
