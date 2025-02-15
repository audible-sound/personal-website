# Personal Website

A modern personal website built with [Astro](https://astro.build/), styled with [Tailwind CSS](https://tailwindcss.com/), powered by [Bun](https://bun.sh/), and deployed on [Fly.io](https://fly.io/).

Check out the webiste [here](https://audywallacesiegle.fly.dev/).

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - A modern static site builder that delivers lightning-fast performance
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- **Runtime**: [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime & toolkit
- **Deployment**: [Fly.io](https://fly.io/) - A platform for running full-stack apps globally

## Getting Started

### Prerequisites

- Bun installed on your machine
- A Fly.io account (for deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/audible-sound/personal-website.git
cd personal-website
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and visit `http://localhost:4321`

### Building for Production

To create a production build:

```bash
bun run build
```

### Deployment

This project is configured for deployment on Fly.io. To deploy:

1. Install the Fly CLI if you haven't already:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Log in to Fly:
```bash
fly auth login
```

3. Deploy the application:
```bash
fly deploy
```

## Project Structure

```
personal-website/
├── src/
│   ├── components/    # Reusable UI components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Route pages
│   └── styles/        # Global styles and Tailwind configuration
├── public/            # Static assets
├── astro.config.mjs   # Astro configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Project dependencies and scripts
```