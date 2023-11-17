import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "isotope",
  description: "User manual and reference material",
  srcExclude: ["**/README.md"],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: 'User Guide',
        items: [
          { text: 'Content', link: './guide/content' }
        ]
      },
      {
        text: 'Scripting',
        items: [
          { text: 'Overview', link: '/scripting/' },
          { text: 'Glossary', link: '/scripting/glossary' },
          { text: 'Lua Primer', link: '/scripting/primer' },
          { text: 'Logging', link: '/scripting/logging' },
          { text: 'Process Helpers', link: '/scripting/process-helpers' },
          { text: 'Object: profile', link: '/scripting/profile' },
          { text: 'Object: server', link: '/scripting/server' },
          { text: 'Object: output', link: '/scripting/output' },
          { text: 'Object: surface', link: '/scripting/surface' },
          { text: 'Object: visual', link: '/scripting/visual' },
          { text: 'Object: view', link: '/scripting/view' },
          { text: 'Object: media_player', link: '/scripting/media_player' },
          { text: 'Object: group', link: '/scripting/group' },
          { text: 'Object: canvas', link: '/scripting/canvas' },
          { text: 'Object: process', link: '/scripting/process' },
          { text: 'Object: timer', link: '/scripting/timer' },
          { text: 'Object: stream', link: '/scripting/stream' },
          { text: 'Object: serial', link: '/scripting/serial' },
        ]
      }
    ],

//    socialLinks: [
//      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
//    ]
  }
})
