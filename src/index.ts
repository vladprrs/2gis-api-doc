import { ParserApp } from './app';

async function main(): Promise<void> {
  try {
    const app = new ParserApp();
    await app.run();
  } catch (error) {
    console.error('❌ Parser failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Run the application
main().catch(console.error); 