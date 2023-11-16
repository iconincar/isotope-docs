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
        text: 'Scripting',
        items: [
          { text: 'Overview', link: '/scripting/' },
          { text: 'Glossary', link: '/scripting/glossary' },
          { text: 'Object: profile', link: '/scripting/profile' },
          { text: 'Object: server', link: '/scripting/server' },
          { text: 'Object: output', link: '/scripting/output' },
          { text: 'Object: surface', link: '/scripting/surface' },
          { text: 'Object: visual', link: '/scripting/visual' },
          { text: 'Object: view', link: '/scripting/view' },
          { text: 'Object: canvas', link: '/scripting/canvas' }
        ]
      }
    ],

//    socialLinks: [
//      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
//    ]
  }
})
