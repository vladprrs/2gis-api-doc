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
      // Search APIs
      { name: 'places', path: 'search/places/overview', category: 'search' },
      { name: 'geocoder', path: 'search/geocoder/overview', category: 'search' },
      { name: 'suggest', path: 'search/suggest/overview', category: 'search' },
      { name: 'categories', path: 'search/categories/overview', category: 'search' },
      { name: 'regions', path: 'search/regions/overview', category: 'search' },
      { name: 'markers', path: 'search/markers/overview', category: 'search' },
      
      // Navigation APIs
      { name: 'routing', path: 'navigation/routing/overview', category: 'navigation' },
      { name: 'public-transport', path: 'navigation/public-transport/overview', category: 'navigation' },
      { name: 'directions', path: 'navigation/directions/overview', category: 'navigation' },
      { name: 'pairs', path: 'navigation/pairs/overview', category: 'navigation' },
      { name: 'truck-directions', path: 'navigation/truck-directions/overview', category: 'navigation' },
      { name: 'distance-matrix', path: 'navigation/distance-matrix/overview', category: 'navigation' },
      { name: 'tsp', path: 'navigation/tsp/overview', category: 'navigation' },
      { name: 'isochrone', path: 'navigation/isochrone/overview', category: 'navigation' },
      { name: 'map-matching', path: 'navigation/map-matching/overview', category: 'navigation' },
      { name: 'radar', path: 'navigation/radar/overview', category: 'navigation' }
    ];
    
    // Group APIs by category
    const apisByCategory = apis.reduce((acc, api) => {
      if (!acc[api.category]) {
        acc[api.category] = [];
      }
      acc[api.category].push(api);
      return acc;
    }, {} as Record<string, typeof apis>);
    
    for (const api of apis) {
      try {
        console.log(`📥 Processing ${api.name} API...`);
        
        // Fetch documentation page (English version)
        const docUrl = `${this.config.baseUrl}/en/api/${api.path}`;
        const html = await this.scraper.fetchPage(docUrl);
        
        // Convert to Markdown
        const markdown = await this.parser.parseHTML(html);
        
        // Save documentation
        const docPath = path.join(this.config.outputDir, api.category, `${api.name}-api.md`);
        await this.storage.saveFile(markdown, docPath);
        
        // Fetch and save OpenAPI spec
        try {
          const openApiContent = await this.scraper.fetchOpenAPI(api.name);
          const openApiPath = path.join(this.config.outputDir, 'openapi', api.category, `${api.name}.json`);
          await this.storage.saveFile(openApiContent, openApiPath);
        } catch (error) {
          console.warn(`⚠️  Could not fetch OpenAPI spec for ${api.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        console.log(`✅ Completed ${api.name} API`);
      } catch (error) {
        console.error(`❌ Failed to process ${api.name} API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Create index files for each category
    await this.createCategoryIndexes(apisByCategory);
    
    // Create main README
    await this.createMainReadme(apisByCategory);
    
    console.log('🎉 Document parsing completed!');
  }

  private async createCategoryIndexes(apisByCategory: Record<string, Array<{ name: string; path: string; category: string }>>): Promise<void> {
    for (const [category, apis] of Object.entries(apisByCategory)) {
      const categoryTitle = category === 'search' ? 'Search APIs' : 'Navigation APIs';
      const categoryDescription = category === 'search' 
        ? 'APIs for searching organizations, geocoding and data management'
        : 'APIs for navigation, routing and logistics';
      
      let indexContent = `# ${categoryTitle}\n\n`;
      indexContent += `${categoryDescription}\n\n`;
      indexContent += `## Available APIs\n\n`;
      
      for (const api of apis) {
        const apiTitle = this.getApiTitle(api.name);
        indexContent += `- [${apiTitle}](./${api.name}-api.md) - ${this.getApiDescription(api.name)}\n`;
      }
      
      const indexPath = path.join(this.config.outputDir, category, 'README.md');
      await this.storage.saveFile(indexContent, indexPath);
    }
  }

  private async createMainReadme(apisByCategory: Record<string, Array<{ name: string; path: string; category: string }>>): Promise<void> {
    let readmeContent = `# 2GIS API Documentation\n\n`;
    readmeContent += `Documentation for all available 2GIS APIs, extracted from official sources.\n\n`;
    readmeContent += `## API Categories\n\n`;
    
    for (const [category, apis] of Object.entries(apisByCategory)) {
      const categoryTitle = category === 'search' ? 'Search APIs' : 'Navigation APIs';
      const categoryDescription = category === 'search' 
        ? 'APIs for searching organizations, geocoding and data management'
        : 'APIs for navigation, routing and logistics';
      
      readmeContent += `### [${categoryTitle}](./${category}/README.md)\n\n`;
      readmeContent += `${categoryDescription}\n\n`;
      
      for (const api of apis) {
        const apiTitle = this.getApiTitle(api.name);
        readmeContent += `- [${apiTitle}](./${category}/${api.name}-api.md)\n`;
      }
      readmeContent += '\n';
    }
    
    readmeContent += `## Documentation Updates\n\n`;
    readmeContent += `Documentation is automatically updated from official 2GIS sources.\n`;
    readmeContent += `Last updated: ${new Date().toLocaleString('en-US')}\n\n`;
    readmeContent += `## Source\n\n`;
    readmeContent += `Official documentation: https://docs.2gis.com/\n`;
    
    const readmePath = path.join(this.config.outputDir, 'README.md');
    await this.storage.saveFile(readmeContent, readmePath);
  }

  private getApiTitle(apiName: string): string {
    const titles: Record<string, string> = {
      'places': 'Places API',
      'geocoder': 'Geocoder API',
      'suggest': 'Suggest API',
      'categories': 'Categories API',
      'regions': 'Regions API',
      'markers': 'Markers API',
      'routing': 'Routing API',
      'public-transport': 'Public Transport API',
      'directions': 'Directions API',
      'pairs': 'Pairs Directions API',
      'truck-directions': 'Truck Directions API',
      'distance-matrix': 'Distance Matrix API',
      'tsp': 'TSP API',
      'isochrone': 'Isochrone API',
      'map-matching': 'Map Matching API',
      'radar': 'Radar API'
    };
    return titles[apiName] || `${apiName} API`;
  }

  private getApiDescription(apiName: string): string {
    const descriptions: Record<string, string> = {
      'places': 'Search for organizations, buildings and places',
      'geocoder': 'Forward and reverse geocoding',
      'suggest': 'Autocomplete for search',
      'categories': 'Work with organization categories',
      'regions': 'Information about regions and administrative units',
      'markers': 'Work with map markers',
      'routing': 'Route building',
      'public-transport': 'Public transport routes',
      'directions': 'Direction building (deprecated)',
      'pairs': 'Routes between pairs of points (deprecated)',
      'truck-directions': 'Truck transport routes (deprecated)',
      'distance-matrix': 'Distance matrix between points',
      'tsp': 'Traveling salesman problem solution',
      'isochrone': 'Isochrone areas',
      'map-matching': 'Track matching to road network',
      'radar': 'Search for objects within radius'
    };
    return descriptions[apiName] || 'Description not available';
  }
} 