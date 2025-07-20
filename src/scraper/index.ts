import fetch from 'node-fetch';
import { Scraper } from '../types';

export class SimpleScraper implements Scraper {
  async fetchPage(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch page ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async fetchOpenAPI(apiName: string): Promise<string> {
    // Try different URL patterns for OpenAPI specs
    const urlPatterns = [
      `https://docs.2gis.com/ru/api/search/${apiName}/openapi.json`,
      `https://docs.2gis.com/ru/api/navigation/${apiName}/openapi.json`,
      `https://docs.2gis.com/ru/api/${apiName}/openapi.json`
    ];
    
    for (const url of urlPatterns) {
      try {
        return await this.fetchPage(url);
      } catch (error) {
        // Continue to next pattern if this one fails
        continue;
      }
    }
    
    throw new Error(`OpenAPI spec not found for ${apiName}`);
  }
} 