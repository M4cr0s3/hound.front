export const PLATFORMS = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'logos:javascript',
    categories: ['language']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'logos:typescript-icon',
    categories: ['language']
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'logos:python',
    categories: ['language']
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'logos:java',
    categories: ['language']
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: 'logos:c-sharp',
    categories: ['language']
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'logos:php',
    categories: ['language']
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: 'logos:ruby',
    categories: ['language']
  },
  {
    id: 'go',
    name: 'Go',
    icon: 'logos:go',
    categories: ['language']
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: 'logos:rust',
    categories: ['language']
  },
  {
    id: 'react',
    name: 'React',
    icon: 'logos:react',
    categories: ['frontend', 'framework']
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: 'logos:vue',
    categories: ['frontend', 'framework']
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'logos:angular-icon',
    categories: ['frontend', 'framework']
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: 'logos:svelte-icon',
    categories: ['frontend', 'framework']
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'logos:nextjs-icon',
    categories: ['frontend', 'framework']
  },
  {
    id: 'nuxtjs',
    name: 'Nuxt.js',
    icon: 'logos:nuxt-icon',
    categories: ['frontend', 'framework']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: 'logos:nodejs-icon',
    categories: ['backend', 'runtime']
  },
  {
    id: 'express',
    name: 'Express',
    icon: 'logos:express',
    categories: ['backend', 'framework']
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: 'logos:nestjs',
    categories: ['backend', 'framework']
  },
  {
    id: 'django',
    name: 'Django',
    icon: 'logos:django-icon',
    categories: ['backend', 'framework']
  },
  {
    id: 'flask',
    name: 'Flask',
    icon: 'logos:flask',
    categories: ['backend', 'framework']
  },
  {
    id: 'laravel',
    name: 'Laravel',
    icon: 'logos:laravel',
    categories: ['backend', 'framework']
  },
  {
    id: 'rails',
    name: 'Ruby on Rails',
    icon: 'logos:rails',
    categories: ['backend', 'framework']
  },
  {
    id: 'spring',
    name: 'Spring',
    icon: 'logos:spring-icon',
    categories: ['backend', 'framework']
  },
  {
    id: 'dotnet',
    name: '.NET',
    icon: 'logos:dotnet',
    categories: ['backend', 'framework']
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'logos:docker-icon',
    categories: ['devops']
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: 'logos:kubernetes',
    categories: ['devops']
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: 'logos:aws',
    categories: ['cloud']
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    icon: 'logos:google-cloud',
    categories: ['cloud']
  },
  {
    id: 'azure',
    name: 'Azure',
    icon: 'logos:microsoft-azure',
    categories: ['cloud']
  }
] as const;

export type Platform = typeof PLATFORMS[number];