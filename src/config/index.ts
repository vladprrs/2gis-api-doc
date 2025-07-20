import { Config } from '../types';

export function loadConfig(): Config {
  return {
    outputDir: process.env.OUTPUT_DIR || './docs',
    baseUrl: process.env.BASE_URL || 'https://docs.2gis.com'
  };
} 