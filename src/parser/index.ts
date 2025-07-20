import { Parser } from '../types';

export class MarkdownParser implements Parser {
  async parseHTML(html: string): Promise<string> {
    // Simple HTML to Markdown conversion
    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1')
      .replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1')
      .replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1')
      .replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1')
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre[^>]*>(.*?)<\/pre>/g, '```\n$1\n```')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<ul[^>]*>(.*?)<\/ul>/g, '$1')
      .replace(/<ol[^>]*>(.*?)<\/ol>/g, '$1')
      .replace(/<li[^>]*>(.*?)<\/li>/g, '- $1')
      .replace(/<br[^>]*>/g, '\n')
      .replace(/<hr[^>]*>/g, '---\n')
      .replace(/<div[^>]*>(.*?)<\/div>/g, '$1')
      .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    return markdown;
  }
} 