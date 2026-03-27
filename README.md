# Todo App

A full-stack todo application built with Next.js, TypeScript, and Supabase PostgreSQL.

## Features

- Add, edit, delete todos
- Mark todos as completed
- Responsive UI with Tailwind CSS
- RESTful API with Next.js API routes
- Supabase PostgreSQL database
- Real-time updates ready

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Custom components (inspired by shadcn/ui)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free at https://supabase.com)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Create a Supabase Project**:
   - Go to https://supabase.com and sign up/login
   - Click "New Project"
   - Fill in project details and wait for it to be created

4. **Set Up Database Schema**:
   - Go to your Supabase dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the contents of `supabase/schema.sql` and paste it into the editor
   - Click "Run" to create the todos table

5. **Get Your Credentials**:
   - Go to Settings → API in your Supabase dashboard
   - Copy: `Project URL` and `anon public key`
   - Go to Settings → Database
   - Copy: `Database password` (or service role key from Settings → API)

6. **Configure Environment Variables**:
   - Rename `.env.local.example` to `.env.local` (or create it)
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-dashboard
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

7. **Run the development server**:
   ```bash
   npm run dev
   ```

8. **Open the app**:
   - Navigate to http://localhost:3000
   - The app will automatically redirect to `/todo`

## API Endpoints

- `GET /api/todos` - Get all todos (sorted by newest first)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Database Schema

The `todos` table has the following columns:
- `id` (UUID) - Primary key
- `title` (TEXT) - Todo title (required)
- `description` (TEXT) - Optional description
- `completed` (BOOLEAN) - Whether the todo is completed
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Project Structure

```
├── app/
│   ├── api/todos/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── todo/page.tsx
│   └── page.tsx
├── component/ui/          # UI components
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── supabase/
│   └── schema.sql        # Database schema
└── ...
```

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Connection Error
If you see "Failed to fetch todos", check:
1. Your Supabase credentials in `.env.local`
2. The `todos` table exists (run the SQL schema)
3. Your Supabase project is active

### CORS Issues
If you get CORS errors, make sure to configure CORS in your Supabase settings or use proper authentication.

## License

MIT

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# kyptronix-practice
