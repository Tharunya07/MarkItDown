# MarkItDown

**MarkItDown**is a web-based HTML-to-Markdown converter that enables users to instantly transform HTML content (such as copied rich-text or formatted text from websites) into GitHub-flavored Markdown format. It provides a live HTML preview and supports theme toggling between light and dark modes.

---

## Features

- **Clipboard Integration**: Automatically detects and processes pasted HTML or plain text.
- **Custom Markdown Converter**: Implements a custom HTML-to-Markdown parser without relying on third-party conversion libraries.
- **Live Markdown Editing**: Users can edit the Markdown output in real time.
- **Real-Time HTML Rendering**: A rendered HTML preview updates instantly based on Markdown changes.
- **Theme Toggle**: Switch between light and dark themes.
- **Download Option**: Markdown output can be downloaded as a`.md`file.

---

## Technology Stack

- **React**(with functional components and hooks)
- **Tailwind CSS**(for styling and theme support)
- **Marked**(for Markdown-to-HTML conversion)
- **file-saver**(for exporting the Markdown file)

---
  ## How to Use

1. Run the app in a browser.
2. Copy formatted content (from web, Notion, etc.).
3. Paste it into the input box.
4. View:
- Converted Markdown (editable)
- Live HTML rendering
5. Download as`.md`.
