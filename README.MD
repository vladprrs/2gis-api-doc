# 2GIS Document Parser

A TypeScript-based automated parser for extracting and maintaining 2GIS API documentation in a structured repository.

## 📋 Overview

This project automatically scrapes, parses, and maintains up-to-date copies of 2GIS API documentation from the official 2GIS documentation site. It extracts English documentation only, converts HTML pages to Markdown format, extracts OpenAPI specifications, and organizes everything in a structured repository for easy access and version control.

## ✨ Features

- **Documentation Scraping**: Fetches 2GIS API documentation from official sources
- **HTML to Markdown**: Converts documentation pages to Markdown format
- **OpenAPI Support**: Extracts and preserves OpenAPI specifications
- **Git Integration**: Maintains version history of documentation changes
- **English Documentation**: Extracts English documentation from 2GIS
- **Simple Configuration**: Easy setup with environment variables

## 🏗️ Architecture

The parser is built with TypeScript and has a simple structure:

- **Scraper**: Fetches documentation pages from 2GIS
- **Parser**: Converts HTML to Markdown
- **Storage**: Saves files to local directory

See [ARCH.MD](./ARCH.MD) for detailed architecture documentation.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- TypeScript 5.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/2gis-doc-parser.git
cd 2gis-doc-parser

# Install dependencies
npm install
```

### Configuration

Create a `.env` file with your configuration:

```env
# Output directory
OUTPUT_DIR=./docs
```

### Usage

#### Usage

```bash
# Run the parser
npm start

# Or run directly
node dist/index.js
```

## 📁 Project Structure

```
2gis-doc-parser/
├── src/
│   ├── scraper.ts         # Fetches documentation pages
│   ├── parser.ts          # Converts HTML to Markdown
│   ├── storage.ts         # Saves files
│   └── index.ts           # Main entry point
├── docs/                  # Generated documentation
│   ├── places-api.md      # Places API documentation
│   ├── geocoder-api.md    # Geocoder API documentation
│   └── openapi/           # OpenAPI specifications
└── package.json
```

## 🔧 Configuration

The parser uses simple environment variables:

```typescript
interface Config {
  outputDir: string;        // Output directory
  baseUrl: string;          // 2GIS docs base URL (optional)
}
```

## 📊 Supported APIs

The parser extracts documentation for:

- **Places API** - Search for organizations and places
- **Geocoder API** - Forward and reverse geocoding
- **Suggest API** - Autocomplete suggestions

## 🔄 How It Works

1. **Fetch**: Downloads documentation pages from 2GIS
2. **Convert**: Transforms HTML to Markdown format
3. **Save**: Stores files in the output directory

## 📚 Output

The parser creates Markdown files with the documentation:

```
docs/
├── places-api.md      # Places API documentation
├── geocoder-api.md    # Geocoder API documentation
└── openapi/
    ├── places.json    # OpenAPI specification
    └── geocoder.json  # OpenAPI specification
```

## 📈 Logging

The parser logs basic information:

- Successfully downloaded pages
- Conversion errors
- File save operations

## 🔒 Legal

This project respects 2GIS's terms of service:

- Content is for personal use only
- Proper attribution to 2GIS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 2GIS for providing comprehensive API documentation
- The open-source community for tools and libraries used in this project

## 📞 Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/your-username/2gis-doc-parser/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/2gis-doc-parser/discussions)
- **Email**: support@your-domain.com

## 📚 Documentation

- [Architecture Guide](./ARCH.MD) - Technical details

---

**Note**: This project is not affiliated with 2GIS. It's an independent tool for developers who use 2GIS APIs and want to maintain local copies of documentation for offline access and version control. 