import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "isotope",
  description: "User manual and reference material",
  srcExclude: ["**/README.md"],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user/' },
      { text: 'Admin Guide', link: '/admin/' },
      { text: 'Scripting Reference', link: '/scripting/' },
    ],

    sidebar: [
      {
        text: 'User Guide',
        items: [
          { text: 'Overview', link: '/user/' },
          { text: 'What is isotope?', link: '/user/what-is-isotope' },
          { text: 'Using Web Content', link: '/user/using-web' },
          { text: 'Using Unity', link: '/user/using-unity' },
          { text: 'Using Unreal Engine', link: '/user/using-unreal' },
          { text: 'Using ProtoPie', link: '/user/using-protopie' },
          { text: 'Web Console', link: '/user/web-console' },
          { text: 'TBD', link: '/user/tbd' }
        ]
      },
      {
        text: 'Admin Guide',
        items: [
          { text: 'Overview', link: '/admin/' },
          { text: 'Requirements', link: '/admin/requirements' },
          { text: 'Installation', link: '/admin/installation' },
          { text: 'Enrollment', link: '/admin/enrollment' },
          { text: 'System Configuration', link: '/admin/configuration' },
          { text: 'Finding the Computer', link: '/admin/finding-the-computer' },
          { text: 'Touch Setup', link: '/admin/touch-setup' },
          { text: 'Shutting Down', link: '/admin/shutting-down' },
          { text: 'Cockpit', link: '/admin/cockpit' },
          { text: 'Desktop Mode', link: '/admin/desktop-mode' },
          { text: 'Salt Cookbook', link: '/admin/salt-cookbook' }
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
