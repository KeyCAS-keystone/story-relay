# Story Relay

A collaborative story-writing platform where users can contribute to branching narratives. Each story can have up to 5 different continuations, creating a unique and dynamic storytelling experience.

## Features

- Tree-like story structure with up to 5 branches per node
- User submissions with content and summary
- Admin panel for content moderation
- Real-time updates and notifications
- Modern, responsive UI

## Tech Stack

- Frontend: Next.js + TypeScript
- Database: Supabase
- Styling: Tailwind CSS
- Authentication: Supabase Auth

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/story-relay.git
cd story-relay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/20240321000000_initial_schema.sql`
   - Copy your project URL and anon key to the `.env` file

5. Start the development server:
```bash
npm run dev
```

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (Text, Unique)
- username (Text, Unique)
- created_at (Timestamp)
- is_admin (Boolean)

### Nodes Table
- id (UUID, Primary Key)
- parent_id (UUID, Foreign Key to nodes.id)
- content (Text)
- summary (Text)
- author_id (UUID, Foreign Key to users.id)
- created_at (Timestamp)
- status (Text: 'pending', 'approved', 'rejected')
- position (Integer: 1-5)

### Submissions Table
- id (UUID, Primary Key)
- node_id (UUID, Foreign Key to nodes.id)
- author_id (UUID, Foreign Key to users.id)
- content (Text)
- summary (Text)
- status (Text: 'pending', 'approved', 'rejected')
- created_at (Timestamp)
- updated_at (Timestamp)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
