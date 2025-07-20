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
    
    const apis = ['places', 'geocoder', 'suggest'];
    
    for (const api of apis) {
      try {
        console.log(`📥 Processing ${api} API...`);
        
        // Fetch documentation page
        const docUrl = `${this.config.baseUrl}/en/api/${api}`;
        const html = await this.scraper.fetchPage(docUrl);
        
        // Convert to Markdown
        const markdown = await this.parser.parseHTML(html);
        
        // Save documentation
        const docPath = path.join(this.config.outputDir, `${api}-api.md`);
        await this.storage.saveFile(markdown, docPath);
        
        // Fetch and save OpenAPI spec
        try {
          const openApiContent = await this.scraper.fetchOpenAPI(api);
          const openApiPath = path.join(this.config.outputDir, 'openapi', `${api}.json`);
          await this.storage.saveFile(openApiContent, openApiPath);
        } catch (error) {
          console.warn(`⚠️  Could not fetch OpenAPI spec for ${api}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        console.log(`✅ Completed ${api} API`);
      } catch (error) {
        console.error(`❌ Failed to process ${api} API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log('🎉 Document parsing completed!');
  }
} 