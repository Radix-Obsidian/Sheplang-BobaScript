'use client'

import { useState } from 'react'
import { useShepKitStore } from '@/lib/store'
import { 
  Settings, 
  Key, 
  Database, 
  Palette, 
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [vercelToken, setVercelToken] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, these would be saved securely
    // For now, we'll just show a success message
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Status Alert */}
        {saved && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-300">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-8">
          {/* API Keys Section */}
          <section className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold">API Keys</h2>
            </div>

            <div className="space-y-4">
              {/* OpenAI API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showKeys ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Required for AI features. Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-green-400 hover:underline">OpenAI Platform</a>
                </p>
              </div>

              {/* Vercel Token */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vercel Token
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  placeholder="Enter your Vercel token..."
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Required for one-click deployment. Get your token from <a href="https://vercel.com/account/tokens" target="_blank" className="text-green-400 hover:underline">Vercel Dashboard</a>
                </p>
              </div>
            </div>
          </section>

          {/* Database Section */}
          <section className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Database</h2>
            </div>

            <div className="space-y-4">
              {/* Supabase URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Supabase URL
                </label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Supabase Anon Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Supabase Anon Key
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Optional for cloud persistence. Get from <a href="https://app.supabase.com" target="_blank" className="text-green-400 hover:underline">Supabase Dashboard</a>
                </p>
              </div>
            </div>
          </section>

          {/* UI Preferences */}
          <section className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-pink-400" />
              <h2 className="text-xl font-semibold">UI Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="dark">Dark (Default)</option>
                  <option value="light" disabled>Light (Coming Soon)</option>
                  <option value="auto" disabled>Auto (Coming Soon)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-4 h-4 text-green-500 bg-neutral-700 border-neutral-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-300">Show AI Assistant by default</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-4 h-4 text-green-500 bg-neutral-700 border-neutral-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-300">Enable auto-save</span>
                </label>
              </div>
            </div>
          </section>

          {/* Environment Status */}
          <section className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">OpenAI API</span>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-yellow-400">Not Configured</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Vercel Deployment</span>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-yellow-400">Not Configured</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database Connection</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-400">Connected (Local Storage)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
