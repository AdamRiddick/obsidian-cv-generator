# CV Generator - Obsidian Plugin

An Obsidian plugin for CV generation. This plugin allows you to generate a PDF version of your CV directly within your Obsidian vault.

## Credit

Credit to https://github.com/xthecapx/Thecap-cv-generator.

This started as a fork of the above to customise some of the features & CV formatting.

This is released under the same [GPL License](#license). All changes can be found through the git history.

## Features

- Create and edit CVs using markdown format.
- Preview & save your CV in PDF format.

## Testing locally

1. Create a test vault in Obsidian (Note: If you do this against an in-use vault, you COULD lose data if you fuck something up).
1. In the vault folder, create the `.obsidian\plugins` folder.
1. Clone the repo into the vault plugins folder.
1. In Obsidian, navigate to Community Plugins and enable the plugin.
1. Run `npm install`
1. Run `npm run dev`

> Note that changes will be automatically built, however the plugin must be disabled then re-enabled to update in Obsidian, unless you use something like [Hot Reload](https://github.com/pjeby/hot-reload)

## Build

1. `npm install`
1. `npm build`
1. `npm version`

## Release

Two Options;
1. Copy the compiled plugin into the plugins folder for your vault, as per the [test steps](#testing-locally).
2. Submit it as a community plugin to Obsidian.

## Obsidian Usage

There are two ways to open the curriculum preview:

1. **Ribbon Icon**: Click the PDF file icon (📄) in the left sidebar ribbon to "Preview CV"
2. **Command Palette**: Open the command palette (Cmd/Ctrl + P) and search for "Open CV preview"

## Notation Guide

Use the following markdown notation to structure your CV:

| Notation | Description | Example |
|----------|-------------|----------|
| `# Name` | Your name followed by contact details | `# John Doe` |
| `- key: text : linkType?` | Contact details (under name). Link type (optional) can be any link rel (tel:, mailto: https://). | `- email: john@example.com \| mailto:` |
| `## Section` | Main section | `## Experience` |
| `## Section \break` | Section with page break after | `## Education \break` |
| `### Title \| Right Text` | Subsection with title and optional right-aligned text | `### Software Engineer \| 2020-Present` |
| `### Title \break` | Item with page break after | `### Project Lead \break` |
| `#### Subtitle \| Right Text` | Subtitle with optional right-aligned text | `#### Team Lead \| New York` |
| `- Content` | Bullet point content | `- Led team of 5 developers` |
| `Content` | Paragraph content | `An experienced software engineer.` |
| `<br>` | Line break | |
| `**text** | Bold. Note: this only works in content | `**text**` |

### Example

[See the Markdown Example](Meta/example.md)

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](/LICENSE) file for details.

What this means:
- ✔️ You can use this software for commercial purposes
- ✔️ You can modify the source code
- ✔️ You can distribute modified versions
- ❗ You must keep the source code open source
- ❗ You must state changes made to the code
- ❗ You must disclose your source code
- ❗ You must use the same license (GPL-3.0)
