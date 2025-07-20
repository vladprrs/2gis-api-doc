export interface Config {
  outputDir: string;
  baseUrl: string;
}

export interface Scraper {
  fetchPage(url: string): Promise<string>;
  fetchOpenAPI(apiName: string): Promise<string>;
}

export interface Parser {
  parseHTML(html: string): Promise<string>;
}

export interface Storage {
  saveFile(content: string, path: string): Promise<void>;
}

export interface ParserApp {
  run(): Promise<void>;
} 