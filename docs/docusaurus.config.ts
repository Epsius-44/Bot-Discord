import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Luzidocs",
  tagline: "Documentation du bot discord Epsius",
  favicon: "img/favicon.svg",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://docs-epsius.luzilab.net",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "fr",
    locales: ["fr"]
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "./contents/docs",
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/docs",
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://gitlab.com/Luzilab/luzidocs/-/tree/main/"
        },
        blog: {
          path: "./contents/changelog",
          routeBasePath: "/changelog",
          showReadingTime: true,
          showLastUpdateTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true
          },

          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://gitlab.com/Luzilab/luzidocs/-/tree/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn"
        },
        theme: {
          customCss: "./src/css/custom.css"
        }
      } satisfies Preset.Options
    ]
  ],

  markdown: {
    mermaid: true
  },

  plugins: [
    [
      "@acid-info/docusaurus-og",
      {
        path: "./og", // relative to the build directory
        imageRenderers: {
          "docusaurus-plugin-content-docs": require("./lib/ImageRenderers")
            .docs,
          // 'docusaurus-plugin-content-pages': require('./lib/ImageRenderers').pages,
          "docusaurus-plugin-content-blog": require("./lib/ImageRenderers").blog
        }
      }
    ],
    [require.resolve("./src/plugins/docusaurus-twemoji-plugin.js"), {}]
  ],

  themes: ["@docusaurus/theme-mermaid"],

  themeConfig: {
    // Replace with your project's social card
    image: "img/luzidocs-social-card.png",
    navbar: {
      // title: 'Luzidocs',
      logo: {
        alt: "Luzidocs Logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg"
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "wikiSidebar",
          position: "left",
          label: "Docs"
        },
        { to: "/changelog", label: "Changelog", position: "left" },
        {
          href: "https://gitlab.com/Luzilab/luzidocs",
          label: "GitLab",
          position: "right"
        }
      ]
    },
    announcementBar: {
      id: "work_in_progress",
      content:
        '<span style="font-weight: bold;">⚠️ Ce site est en cours de rédaction. Il peut contenir des erreurs ou des informations incomplètes ! ⚠️</span>',
      backgroundColor: "#1f60af",
      textColor: "#fafafa",
      isCloseable: false
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Luzidocs. Built with <a class="footer__link-item" href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">Docusaurus</a>.`
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["bash"]
    }
  } satisfies Preset.ThemeConfig
};

export default config;
