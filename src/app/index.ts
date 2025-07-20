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
        
        // Fetch documentation page
        const docUrl = `${this.config.baseUrl}/ru/api/${api.path}`;
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
        ? 'APIs для поиска организаций, геокодирования и работы с данными'
        : 'APIs для навигации, маршрутизации и логистики';
      
      let indexContent = `# ${categoryTitle}\n\n`;
      indexContent += `${categoryDescription}\n\n`;
      indexContent += `## Доступные API\n\n`;
      
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
    readmeContent += `Документация всех доступных API 2GIS, извлеченная из официальных источников.\n\n`;
    readmeContent += `## Категории API\n\n`;
    
    for (const [category, apis] of Object.entries(apisByCategory)) {
      const categoryTitle = category === 'search' ? 'Search APIs' : 'Navigation APIs';
      const categoryDescription = category === 'search' 
        ? 'APIs для поиска организаций, геокодирования и работы с данными'
        : 'APIs для навигации, маршрутизации и логистики';
      
      readmeContent += `### [${categoryTitle}](./${category}/README.md)\n\n`;
      readmeContent += `${categoryDescription}\n\n`;
      
      for (const api of apis) {
        const apiTitle = this.getApiTitle(api.name);
        readmeContent += `- [${apiTitle}](./${category}/${api.name}-api.md)\n`;
      }
      readmeContent += '\n';
    }
    
    readmeContent += `## Обновление документации\n\n`;
    readmeContent += `Документация автоматически обновляется из официальных источников 2GIS.\n`;
    readmeContent += `Последнее обновление: ${new Date().toLocaleString('ru-RU')}\n\n`;
    readmeContent += `## Источник\n\n`;
    readmeContent += `Официальная документация: https://docs.2gis.com/\n`;
    
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
      'places': 'Поиск организаций, зданий и мест',
      'geocoder': 'Прямое и обратное геокодирование',
      'suggest': 'Автодополнение для поиска',
      'categories': 'Работа с категориями организаций',
      'regions': 'Информация о регионах и административных единицах',
      'markers': 'Работа с маркерами на карте',
      'routing': 'Построение маршрутов',
      'public-transport': 'Маршруты общественного транспорта',
      'directions': 'Построение направлений (устаревший)',
      'pairs': 'Маршруты между парами точек (устаревший)',
      'truck-directions': 'Маршруты для грузового транспорта (устаревший)',
      'distance-matrix': 'Матрица расстояний между точками',
      'tsp': 'Решение задачи коммивояжера',
      'isochrone': 'Изохронные области',
      'map-matching': 'Привязка треков к дорожной сети',
      'radar': 'Поиск объектов в радиусе'
    };
    return descriptions[apiName] || 'Описание недоступно';
  }
} 