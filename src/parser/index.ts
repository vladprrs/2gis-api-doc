import { Parser } from '../types';

export class MarkdownParser implements Parser {
  async parseHTML(html: string): Promise<string> {
    // Remove DOCTYPE, html, head, body tags
    let markdown = html
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>|<\/body>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      .replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');

    // Convert HTML to Markdown
    markdown = markdown
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1\n\n')
      .replace(/<code[^>]*class="[^"]*language-([^"]*)"[^>]*>(.*?)<\/code>/g, '```$1\n$2\n```\n\n')
      .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, '```\n$1\n```\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/g, () => `${counter++}. $1\n`) + '\n';
      })
      .replace(/<br[^>]*>/g, '\n')
      .replace(/<hr[^>]*>/g, '---\n\n')
      .replace(/<div[^>]*>(.*?)<\/div>/g, '$1')
      .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
      .replace(/<button[^>]*>(.*?)<\/button>/g, '$1')
      .replace(/<nav[^>]*>([\s\S]*?)<\/nav>/g, '')
      .replace(/<aside[^>]*>([\s\S]*?)<\/aside>/g, '')
      .replace(/<header[^>]*>([\s\S]*?)<\/header>/g, '')
      .replace(/<footer[^>]*>([\s\S]*?)<\/footer>/g, '')
      .replace(/<main[^>]*>([\s\S]*?)<\/main>/g, '$1')
      .replace(/<section[^>]*>([\s\S]*?)<\/section>/g, '$1')
      .replace(/<article[^>]*>([\s\S]*?)<\/article>/g, '$1')
      .replace(/<form[^>]*>([\s\S]*?)<\/form>/g, '')
      .replace(/<input[^>]*>/g, '')
      .replace(/<textarea[^>]*>([\s\S]*?)<\/textarea>/g, '')
      .replace(/<select[^>]*>([\s\S]*?)<\/select>/g, '')
      .replace(/<option[^>]*>(.*?)<\/option>/g, '$1')
      .replace(/<label[^>]*>(.*?)<\/label>/g, '$1')
      .replace(/<fieldset[^>]*>([\s\S]*?)<\/fieldset>/g, '$1')
      .replace(/<legend[^>]*>(.*?)<\/legend>/g, '**$1**\n')
      .replace(/<table[^>]*>([\s\S]*?)<\/table>/g, '\n$1\n')
      .replace(/<thead[^>]*>([\s\S]*?)<\/thead>/g, '$1')
      .replace(/<tbody[^>]*>([\s\S]*?)<\/tbody>/g, '$1')
      .replace(/<tr[^>]*>([\s\S]*?)<\/tr>/g, '$1\n')
      .replace(/<th[^>]*>(.*?)<\/th>/g, '| $1 ')
      .replace(/<td[^>]*>(.*?)<\/td>/g, '| $1 ')
      .replace(/<caption[^>]*>(.*?)<\/caption>/g, '\n*$1*\n')
      .replace(/<colgroup[^>]*>([\s\S]*?)<\/colgroup>/g, '')
      .replace(/<col[^>]*>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '…')
      .replace(/&laquo;/g, '«')
      .replace(/&raquo;/g, '»')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return markdown;
  }
} 