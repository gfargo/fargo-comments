export interface InstallCommand {
  name: string
  command: string
  description: string
  required: boolean
}

export interface InstallationConfig {
  baseUrl: string
  registryUrl: string
  prerequisiteCommand: string
  coreCommands: InstallCommand[]
  additionalAdapters: InstallCommand[]
  quickLinks: {
    name: string
    url: string
    external?: boolean
  }[]
}

export const installationConfig: InstallationConfig = {
  baseUrl: "https://commentsby.griffen.codes",
  registryUrl: "https://commentsby.griffen.codes/api/registry",
  prerequisiteCommand: "npx shadcn@latest init",
  
  coreCommands: [
    {
      name: "Core System",
      command: "npx shadcn@latest add https://commentsby.griffen.codes/api/registry/r/core",
      description: "Essential commenting system with contexts, hooks, types, and Lexical editor",
      required: true
    },
    {
      name: "Comment List",
      command: "npx shadcn@latest add https://commentsby.griffen.codes/api/registry/r/comment-list",
      description: "Main comment listing component with search functionality",
      required: false
    },
    {
      name: "Comment Drawer",
      command: "npx shadcn@latest add https://commentsby.griffen.codes/api/registry/r/drawer",
      description: "Sidebar/drawer component for centralized comment management",
      required: false
    },
    {
      name: "Server Actions Adapter",
      command: "npx shadcn@latest add https://commentsby.griffen.codes/api/registry/r/adapter-server-actions",
      description: "Next.js Server Actions storage adapter with React cache integration",
      required: false
    }
  ],

  additionalAdapters: [
    {
      name: "API Adapter",
      command: "npx shadcn@latest add https://commentsby.griffen.codes/api/registry/r/adapter-api",
      description: "REST API integration for external services",
      required: false
    },
    {
      name: "TanStack Query Adapter",
      command: "npx shadcn@latest add https://commentsby.griffen.codes/api/registry/r/adapter-tanstack-query",
      description: "React Query integration with caching and optimistic updates",
      required: false
    }
  ],

  quickLinks: [
    {
      name: "Registry Guide",
      url: "https://github.com/fargo/fargo-comments/blob/main/README-REGISTRY.md",
      external: true
    },
    {
      name: "GitHub Repo",
      url: "https://github.com/fargo/fargo-comments",
      external: true
    },
    {
      name: "ShadcnUI CLI",
      url: "https://ui.shadcn.com/docs/cli",
      external: true
    }
  ]
}