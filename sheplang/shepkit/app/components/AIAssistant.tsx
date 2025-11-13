'use client'

import { useState } from 'react'
import { useShepKitStore } from '@/lib/store'
import { generateCode, explainCode, debugCode } from '@/lib/edge-functions'
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Loader2,
  X
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type AIAction = 'explain' | 'generate' | 'debug'

export function AIAssistant() {
  const { activeFile, transpiledCode, transpileError, toggleAI } = useShepKitStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<AIAction>('explain')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      let result: any;
      const code = activeFile?.content || '';
      
      // Call the appropriate edge function based on selected action
      if (selectedAction === 'generate') {
        result = await generateCode(input, code);
        
        if ('error' in result) {
          throw new Error(result.error);
        }
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: result.code || 'No code was generated.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
      } else if (selectedAction === 'explain') {
        result = await explainCode(code, input);
        
        if ('error' in result) {
          throw new Error(result.error);
        }
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: result.explanation || 'No explanation was generated.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
      } else if (selectedAction === 'debug') {
        result = await debugCode(code, transpileError, transpiledCode, input);
        
        if ('error' in result) {
          throw new Error(result.error);
        }
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: result.debugInfo || 'No debugging information was generated.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
      
    } catch (error) {
      console.error('AI request failed:', error)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request: ' + (error instanceof Error ? error.message : 'Unknown error'),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = async (action: AIAction, prompt: string) => {
    setSelectedAction(action)
    setInput(prompt)
    
    // Auto-send the quick action
    setTimeout(() => {
      const sendButton = document.querySelector<HTMLButtonElement>('#ai-send-btn')
      sendButton?.click()
    }, 100)
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>
        <button
          onClick={toggleAI}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Action Selector */}
      <div className="border-b border-border p-3">
        <div className="flex gap-2">
          {(['explain', 'generate', 'debug'] as AIAction[]).map((action) => (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                selectedAction === action
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-b border-border p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</p>
        <button
          onClick={() => handleQuickAction('explain', 'Explain this code in simple terms')}
          className="w-full text-left px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded flex items-center gap-2"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-foreground">Explain this code</span>
        </button>
        <button
          onClick={() => handleQuickAction('generate', 'Generate a todo list component')}
          className="w-full text-left px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded flex items-center gap-2"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-foreground">Generate component</span>
        </button>
        <button
          onClick={() => handleQuickAction('debug', 'Help me fix this error')}
          className="w-full text-left px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded flex items-center gap-2"
          disabled={!transpileError}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-foreground">Debug error</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">Ask me anything about your code!</p>
            <p className="text-xs mt-2">I can explain, generate, or debug.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask me to ${selectedAction}...`}
            className="flex-1 px-3 py-2 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button
            id="ai-send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
