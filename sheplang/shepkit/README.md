# ShepKit Alpha - Visual IDE for ShepLang

ShepKit transforms ShepLang and BobaScript into a visual IDE where non-technical founders can build and deploy working MVPs.

## Features

- **Visual Editor**: Monaco-based editor with ShepLang syntax highlighting
- **Live Preview**: Real-time transpilation and visual preview
- **AI Assistant**: GPT-4 powered explain, generate, and debug features
- **Project Management**: Full CRUD operations for ShepLang projects
- **One-Click Deploy**: Deploy to Vercel with a single click
- **Database Sync**: Supabase integration for project persistence

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account (optional)
- Vercel account (optional)
- OpenAI API key (optional)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   VERCEL_TOKEN=your-vercel-token
   ```

3. **Set up Supabase (optional)**:
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Initialize local development
   supabase start
   
   # Apply migrations
   supabase db push
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

5. **Open ShepKit**:
   Navigate to `http://localhost:3000`

## Usage

### Creating Projects

1. Click "New Project" in the file explorer
2. Enter a project name
3. Start editing your `.shep` files

### Writing ShepLang

```sheplang
component TodoApp {
  state todos = []
  state newTodo = ""
  
  "My Todo List"
  
  action AddTodo(item) {
    todos.push(item)
    newTodo = ""
  }
}

route "/" -> TodoApp
```

### AI Assistant

- **Explain**: Ask the AI to explain your code
- **Generate**: Request new components or features
- **Debug**: Get help fixing errors

### Deployment

1. Configure your Vercel token (optional)
2. Click "Deploy to Vercel"
3. Your app will be live in seconds

## Architecture

```
shepkit/
├── app/                    # Next.js 14 App Router
│   ├── components/         # React components
│   ├── api/               # API routes
│   └── globals.css        # Tailwind styles
├── lib/                   # Utilities and hooks
│   ├── store.ts          # Zustand state management
│   ├── ai.ts             # OpenAI integration
│   ├── deploy.ts         # Vercel deployment
│   └── hooks/            # Custom React hooks
├── supabase/             # Database schema
│   ├── migrations/       # SQL migrations
│   └── config.toml       # Supabase config
└── package.json          # Dependencies
```

## API Endpoints

- `POST /api/ai/explain` - Explain ShepLang code
- `POST /api/ai/generate` - Generate new code
- `POST /api/ai/debug` - Debug assistance
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects` - Update project
- `DELETE /api/projects` - Delete project
- `POST /api/deploy` - Deploy to Vercel

## Development

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Building

```bash
pnpm build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No |
| `VERCEL_TOKEN` | Vercel API token for deployment | No |
| `VERCEL_TEAM_ID` | Vercel team ID (optional) | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Documentation: [ShepLang Docs](../docs/)
- Issues: [GitHub Issues](https://github.com/your-org/sheplang/issues)
- Discord: [Community Server](https://discord.gg/sheplang)
