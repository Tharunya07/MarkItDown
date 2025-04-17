import React, { useState } from 'react';
import { marked } from 'marked';
import { saveAs } from 'file-saver';

export default function App() {
  const [htmlInput, setHtmlInput] = useState('');
  const [markdownOutput, setMarkdownOutput] = useState('');
  const [theme, setTheme] = useState('light');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    const input = html || text;
    setHtmlInput(input);
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    const markdown = convertNodeToMarkdown(doc.body).trim();
    setMarkdownOutput(markdown);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'converted.md');
  };

  const handleReset = () => {
    setHtmlInput('');
    setMarkdownOutput('');
    setPlaceholderVisible(true);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-gray-800'}`}>
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-100'} w-[60px] h-full flex flex-col items-center py-6 space-y-6`}>
        <div className="space-x-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
        </div>
        <button onClick={handleReset} title="Home" className="text-2xl">🏠</button>
        <button onClick={handleDownload} title="Download Markdown" className="text-2xl">📄</button>
        <button onClick={toggleTheme} title="Toggle Theme" className="text-2xl">
          {theme === 'dark' ? '⚪' : '⚫'}
        </button>
        <button onClick={handleReset} title="Refresh" className="text-2xl">🔄</button>
      </div>

      <div className="flex-grow flex flex-col px-6 py-4 overflow-hidden">
        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>MarkItDown</h1>
        <p className="text-sm mb-2">Convert your HTML to Markdown</p>

        <div className={`w-full h-[160px] ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'} p-4 mb-2 overflow-auto rounded`}>
          <div
            className="w-full h-full bg-transparent resize-none outline-none overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
            contentEditable
            onPaste={handlePaste}
            onFocus={() => setPlaceholderVisible(false)}
            onBlur={() => setPlaceholderVisible(htmlInput.trim() === '')}
            suppressContentEditableWarning={true}
          >
            {placeholderVisible && htmlInput.trim() === '' ? 'Paste the text you want to convert to .mdk' : htmlInput}
          </div>
        </div>

        <div className="flex-grow mt-2 flex space-x-4 overflow-hidden">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'} w-1/2 h-full p-4 overflow-y-auto overflow-x-hidden break-words`}>
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Markdown Output</h2>
            <textarea
              className="w-full h-[calc(100%-2rem)] bg-transparent resize-none outline-none overflow-y-auto overflow-x-hidden break-words"
              value={markdownOutput}
              onChange={e => setMarkdownOutput(e.target.value)}
            />
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'} w-1/2 h-full p-4 overflow-y-auto overflow-x-hidden break-words`}>
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>HTML Preview</h2>
            <div
              className="prose prose-sm max-w-none break-words dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: marked.parse(markdownOutput) }}
            />
          </div>
        </div>

        <div className="text-center text-xs mt-1">
          Created with <span className="text-red-500">♥</span> by <a className="underline" href="https://github.com/Tharunya07" target="_blank" rel="noopener noreferrer">@Tharunya07</a>
        </div>
      </div>
    </div>
  );
}

const convertNodeToMarkdown = (node) => {
  if (!node) return '';
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();

  const tag = node.nodeName.toLowerCase();
  const children = Array.from(node.childNodes).map(convertNodeToMarkdown).join('').trim();

  switch (tag) {
    case 'h1': return `# ${children}\n\n`;
    case 'h2': return `## ${children}\n\n`;
    case 'h3': return `### ${children}\n\n`;
    case 'h4': return `#### ${children}\n\n`;
    case 'h5': return `##### ${children}\n\n`;
    case 'h6': return `###### ${children}\n\n`;
    case 'p': return `${children}\n\n`;
    case 'br': return `  \n`;
    case 'hr': return `---\n\n`;
    case 'strong':
    case 'b': return `**${children}**`;
    case 'em':
    case 'i': return `*${children}*`;
    case 'code': return `\`${children}\``;
    case 'pre': return `\`\`\`\n${children}\n\`\`\`\n`;
    case 'a': {
      const href = node.getAttribute('href');
      return `[${children}](${href})`;
    }
    case 'img': {
      const alt = node.getAttribute('alt') || '';
      const src = node.getAttribute('src') || '';
      return `![${alt}](${src})`;
    }
    case 'ul':
      return Array.from(node.children)
        .map(li => `- ${convertNodeToMarkdown(li).trim()}`)
        .join('\n') + '\n\n';
    case 'ol':
      return Array.from(node.children)
        .map((li, i) => `${i + 1}. ${convertNodeToMarkdown(li).trim()}`)
        .join('\n') + '\n\n';
    case 'li': return children;
    case 'blockquote': return `> ${children}\n\n`;
    case 'div':
    case 'span':
      return children;
    default:
      return children;
  }
};
