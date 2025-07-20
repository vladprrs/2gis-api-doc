import { promises as fs } from 'fs';
import path from 'path';
import { Storage } from '../types';

export class FileStorage implements Storage {
  async saveFile(content: string, filePath: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      // Write file
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Saved: ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to save file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 