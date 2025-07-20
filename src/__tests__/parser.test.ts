import { MarkdownParser } from '../parser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  it('should convert h1 tags to markdown', async () => {
    const html = '<h1>Title</h1>';
    const result = await parser.parseHTML(html);
    expect(result).toContain('# Title');
  });

  it('should convert h2 tags to markdown', async () => {
    const html = '<h2>Subtitle</h2>';
    const result = await parser.parseHTML(html);
    expect(result).toContain('## Subtitle');
  });

  it('should convert p tags to plain text', async () => {
    const html = '<p>This is a paragraph</p>';
    const result = await parser.parseHTML(html);
    expect(result).toContain('This is a paragraph');
  });

  it('should convert code tags to markdown', async () => {
    const html = '<code>const x = 1;</code>';
    const result = await parser.parseHTML(html);
    expect(result).toContain('`const x = 1;`');
  });

  it('should convert pre tags to markdown code blocks', async () => {
    const html = '<pre>function test() {\n  return true;\n}</pre>';
    const result = await parser.parseHTML(html);
    expect(result).toContain('```');
    expect(result).toContain('function test() {');
  });
}); 