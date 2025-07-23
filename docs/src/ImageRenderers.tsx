// @ts-nocheck TS2339

import type { DocsPageData, BlogPageData, BlogPageType, ImageRenderer } from '@acid-info/docusaurus-og'
import { readFileSync } from 'fs'
import { join } from 'path'
import React from 'react'


// Define the image renderer for docs pages
const backgroundImagePath = join(__dirname, '../og-static/img/og-background.jpg')
const backgroundImageBuffer = readFileSync(backgroundImagePath)
const backgroundImageBase64 = `data:image/jpeg;base64,${backgroundImageBuffer.toString('base64')}`

const logoPath = join(__dirname, '../og-static/img/og-logo.png')
const logoBuffer = readFileSync(logoPath)
const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`


// Config common renderer Component
function CommonImageRenderer(props) {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      backgroundImage: `url('${backgroundImageBase64}')`,
      backgroundSize: "100% auto",
      backgroundRepeat: "no-repeat",
    }}>
      <span style={{
        backgroundColor: '#1f60af',
        width: '1em',
      }}></span>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '2em',
        maxWidth: '85%'
      }}>
        <img src={logoBase64} alt="Logo" style={{
          width: '30em',
        }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto'
        }}>
          <span style={{
            fontSize: '4em',
            fontWeight: 800,
            color: "#1f60af",
          }}>{props.title}</span>
          <span style={{
            fontSize: '2em',
          }}>{props.description}</span>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export const docs: ImageRenderer<DocsPageData> = (data, context) => {
  return [
    <CommonImageRenderer title={"󱉟" + data.metadata.title} description={data.metadata.description}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      {data.metadata.lastUpdatedAt && (
        <span style={{
          fontSize: '2em',
          fontWeight: 800,
          color: "#1f60af",
        }}>
          󱦺 {new Date(data.metadata.lastUpdatedAt).toLocaleDateString('fr-FR')}
        </span>
      )}
      {data.metadata.tags && data.metadata.tags.length > 0 && (
        <span style={{
          fontSize: '2em',
          fontWeight: 800,
          color: "#1f60af",
        }}>
           {data.metadata.tags.map(tag => tag.label).join(', ')}
        </span>
      )}
      </div>
    </CommonImageRenderer>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'UbuntuSansNerdFont',
          data: readFileSync(
            join(__dirname, '../og-static/font/UbuntuSansNerdFont-Regular.ttf')
          ),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'UbuntuSansNerdFont',
          data: readFileSync(
            join(__dirname, '../og-static/font/UbuntuSansNerdFont-Bold.ttf')
          ),
          weight: 800,
          style: 'normal',
        }
      ],
    },
  ]
}

export const blog: ImageRenderer<BlogPageData> = (data, context) => {
  const blogPageType = data.pageType as BlogPageType

  if (blogPageType == 'post') {
    return [
      <CommonImageRenderer title={"󰍩" + data.data.metadata.title} description={data.data.metadata.description}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {data.data.metadata.date && (
            <span style={{
              fontSize: '2em',
              fontWeight: 800,
              color: "#1f60af",
            }}>
              󰥔 {data.data.metadata.date.toLocaleDateString('fr-FR')} -  󱦺 {new Date(data.data.metadata.lastUpdatedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
          {data.data.metadata.tags && data.data.metadata.tags.length > 0 && (
            <span style={{
              fontSize: '2em',
              fontWeight: 800,
              color: "#1f60af",
            }}>
               {data.data.metadata.tags.map(tag => tag.label).join(', ')}
            </span>
          )}
          {data.data.metadata.authors && data.data.metadata.authors.length > 0 && (
            <span style={{
              fontSize: '2em',
              fontWeight: 800,
              color: "#1f60af",
            }}>
               {data.data.metadata.authors.map(author => author.name).join(', ')}
            </span>
          )}
        </div>
      </CommonImageRenderer>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Regular.ttf')
            ),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Bold.ttf')
            ),
            weight: 800,
            style: 'normal',
          }
        ],
      },
    ]
  }

  if (blogPageType == 'tag') {
    return [
      <CommonImageRenderer title={"󰍩 Tag: " + data.data.label} description={"Parmi les articles du Blog Luzidocs, " + data.data.totalCount + " articles possèdent le tag " + data.data.label}>
      </CommonImageRenderer>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Regular.ttf')
            ),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Bold.ttf')
            ),
            weight: 800,
            style: 'normal',
          }
        ],
      },
    ]
  }

  if (blogPageType == 'archive') {
    return [
      <CommonImageRenderer title={"󰍩 Archive du Blog"} description={"Liste des articles du Blog Luzidocs"}>
      </CommonImageRenderer>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Regular.ttf')
            ),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Bold.ttf')
            ),
            weight: 800,
            style: 'normal',
          }
        ],
      },
    ]
  }

  if (blogPageType == 'tags') {
    return [
      <CommonImageRenderer title={"󰍩 Tags du Blog"} description={"Liste des tags des articles du Blog Luzidocs"}>
      </CommonImageRenderer>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Regular.ttf')
            ),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Bold.ttf')
            ),
            weight: 800,
            style: 'normal',
          }
        ],
      },
    ]
  }

  if (blogPageType == 'list') {
    return [
      <CommonImageRenderer title={"󰍩 Liste des articles du Blog"} description={"Liste des " + data.data.metadata.totalCount + " articles du Blog Luzidocs"}>
      </CommonImageRenderer>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Regular.ttf')
            ),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'UbuntuSansNerdFont',
            data: readFileSync(
              join(__dirname, '../og-static/font/UbuntuSansNerdFont-Bold.ttf')
            ),
            weight: 800,
            style: 'normal',
          }
        ],
      },
    ]
  }
}
