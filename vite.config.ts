import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import viteBundleAnalyzer from 'vite-bundle-analyzer'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

function dynamicPlugins(mode: string) {
  const plugins = [ViteMinifyPlugin()]
  if (mode === 'production') {
    return plugins
  }

  plugins.push(viteBundleAnalyzer())
  if (mode === 'analyze') {
    return plugins
  }

  return [
    ...plugins,
    devtools({
      removeDevtoolsOnBuild: true,
    }),
  ]
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    ...dynamicPlugins(mode),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-core',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 50,
            },
            {
              name: 'dnd-kit-vendor',
              test: /node_modules[\\/]@dnd-kit[\\/]/,
              priority: 20,
            },
            {
              name: 'icons-vendor',
              test: /node_modules[\\/]@tabler[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
}))
