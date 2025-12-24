# Refine

Turn rough ideas into build-ready prompts

Refine is a simple web app that helps turn rough website ideas into clear, structured prompts you can reuse to build a website.

## How to run the app

### Prerequisites

- Node.js
- pnpm package manager
- OpenAI API key

### Setup

1. **Clone the repository**

2. **Install pnpm** (if not installed)

   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Set up environment variables**

   Copy the example environment file and add your OpenAI API key:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and replace `your_api_key_here` with your actual OpenAI API key.

   You can get an API key from: https://platform.openai.com/api-keys

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

That's it! The app will start and you can use it immediately.

### No API Key?

If you don't have access to an OpenAI API key, you can try the live demo here:

👉 **[Live Demo](https://refine-your-link.vercel.app)** _(replace with your Vercel URL)_

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **AI**: OpenAI GPT-4o-mini
- **Language**: TypeScript
