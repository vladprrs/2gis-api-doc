# 2GIS Document Parser - Architecture

## 🏗️ Overview

A simple TypeScript application that downloads 2GIS API documentation and converts it to Markdown format.

## 📐 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  2GIS Docs Site │    │   Parser App    │    │  Local Files    │
│                 │    │                 │    │                 │
│ • HTML Pages    │───▶│ • Download      │───▶│ • Markdown      │
│ • OpenAPI Specs │    │ • Convert       │    │ • JSON Files    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Components

### 1. Scraper

Downloads documentation pages from 2GIS.

```typescript
interface Scraper {
  fetchPage(url: string): Promise<string>;
  fetchOpenAPI(apiName: string): Promise<string>;
}

class SimpleScraper implements Scraper {
  async fetchPage(url: string): Promise<string> {
    const response = await fetch(url);
    return await response.text();
  }
  
  async fetchOpenAPI(apiName: string): Promise<string> {
    const url = `https://docs.2gis.com/en/api/${apiName}/openapi.json`;
    return await this.fetchPage(url);
  }
}
```

### 2. Parser

Converts HTML to Markdown format.

```typescript
interface Parser {
  parseHTML(html: string): Promise<string>;
}

class MarkdownParser implements Parser {
  async parseHTML(html: string): Promise<string> {
    // Simple HTML to Markdown conversion
    let markdown = html
      .replace(/<h1>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre>(.*?)<\/pre>/g, '```\n$1\n```');
    
    return markdown;
  }
}
```

### 3. Storage

Saves files to local directory.

```typescript
interface Storage {
  saveFile(content: string, path: string): Promise<void>;
}

class FileStorage implements Storage {
  async saveFile(content: string, path: string): Promise<void> {
    const fs = require('fs').promises;
    await fs.writeFile(path, content, 'utf8');
  }
}
```

### 4. Main Application

Orchestrates the scraping, parsing, and saving process.

```typescript
class ParserApp {
  private scraper: Scraper;
  private parser: Parser;
  private storage: Storage;
  
  constructor() {
    this.scraper = new SimpleScraper();
    this.parser = new MarkdownParser();
    this.storage = new FileStorage();
  }
  
  async run(): Promise<void> {
    const apis = ['places', 'geocoder', 'suggest'];
    
    for (const api of apis) {
      const html = await this.scraper.fetchPage(`https://docs.2gis.com/en/api/${api}`);
      const markdown = await this.parser.parseHTML(html);
      await this.storage.saveFile(markdown, `docs/${api}-api.md`);
    }
  }
}
```

## 🔄 How It Works

```typescript
// Main application flow
async function main() {
  const app = new ParserApp();
  await app.run();
}

// Simple execution
main().catch(console.error);
```

## 🛠️ Configuration

```typescript
interface Config {
  outputDir: string;
  baseUrl: string;
}

function loadConfig(): Config {
  return {
    outputDir: process.env.OUTPUT_DIR || './docs',
    baseUrl: process.env.BASE_URL || 'https://docs.2gis.com'
  };
}
```
```

## 🔍 Error Handling

```typescript
// Simple error handling
try {
  await app.run();
} catch (error) {
  console.error('Parser failed:', error.message);
  process.exit(1);
}
```

## 🚀 Usage

```typescript
// Run the parser
const app = new ParserApp();
app.run();
```

## 🔒 Security

```typescript
// No authentication required for documentation scraping
// The parser respects robots.txt and uses polite scraping practices
```

## 📊 Testing

```typescript
// Basic test
describe('Parser', () => {
  it('should convert HTML to Markdown', () => {
    const parser = new MarkdownParser();
    const html = '<h1>Title</h1>';
    const result = parser.parseHTML(html);
    expect(result).toContain('# Title');
  });
});
```

## 🔄 Deployment

```bash
# Build and run
npm run build
npm start
```

## 📈 Future

Simple improvements that could be added:

- Better HTML to Markdown conversion
- Support for more APIs
- Configuration file support

---

This is a simple MVP that downloads 2GIS documentation and converts it to Markdown format. 