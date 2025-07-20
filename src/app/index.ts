import { ParserApp as IParserApp } from '../types';
import { SimpleScraper } from '../scraper';
import { MarkdownParser } from '../parser';
import { FileStorage } from '../storage';
import { loadConfig } from '../config';
import path from 'path';

export class ParserApp implements IParserApp {
  private scraper: SimpleScraper;
  private parser: MarkdownParser;
  private storage: FileStorage;
  private config: ReturnType<typeof loadConfig>;

  constructor() {
    this.scraper = new SimpleScraper();
    this.parser = new MarkdownParser();
    this.storage = new FileStorage();
    this.config = loadConfig();
  }

  async run(): Promise<void> {
    console.log('🚀 Starting 2GIS Document Parser...');
    
    const apis = [
      { name: 'places', path: 'search/places/overview' },
      { name: 'geocoder', path: 'search/geocoder/overview' },
      { name: 'suggest', path: 'search/suggest/overview' }
    ];
    
    for (const api of apis) {
      try {
        console.log(`📥 Processing ${api.name} API...`);
        
        // Fetch documentation page
        const docUrl = `${this.config.baseUrl}/ru/api/${api.path}`;
        const html = await this.scraper.fetchPage(docUrl);
        
        // Convert to Markdown
        const markdown = await this.parser.parseHTML(html);
        
        // Save documentation
        const docPath = path.join(this.config.outputDir, `${api.name}-api.md`);
        await this.storage.saveFile(markdown, docPath);
        
        // Fetch and save OpenAPI spec
        try {
          const openApiContent = await this.scraper.fetchOpenAPI(api.name);
          const openApiPath = path.join(this.config.outputDir, 'openapi', `${api.name}.json`);
          await this.storage.saveFile(openApiContent, openApiPath);
        } catch (error) {
          console.warn(`⚠️  Could not fetch OpenAPI spec for ${api.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        console.log(`✅ Completed ${api.name} API`);
      } catch (error) {
        console.error(`❌ Failed to process ${api.name} API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log('🎉 Document parsing completed!');
  }
} 