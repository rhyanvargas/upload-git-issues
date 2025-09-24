# 🚀 Upload Git Issues

A zero-config CLI tool to bulk upload CSV data to GitHub Issues with beautiful terminal UI and progress indicators.

## ✨ Features

- **Zero Configuration**: Just run the command and follow the prompts
- **Interactive CLI**: Beautiful terminal interface with progress indicators
- **Flexible CSV Support**: Automatically maps common CSV column names
- **GitHub Integration**: Seamless authentication and repository selection
- **Dry Run Mode**: Preview issues before creating them
- **Smart Validation**: Comprehensive data validation with helpful error messages
- **Progress Tracking**: Real-time progress indicators and success links
- **Error Handling**: Graceful error handling with detailed feedback

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx upload-git-issues path/to/your/issues.csv
```

### Global Installation

```bash
npm install -g upload-git-issues
upload-git-issues path/to/your/issues.csv
```

## 📋 Usage

### Basic Usage

```bash
# Interactive mode - prompts for all required information
npx upload-git-issues

# Specify CSV file
npx upload-git-issues ./my-issues.csv

# With GitHub token (skip authentication prompt)
npx upload-git-issues ./issues.csv --token ghp_your_token_here

# Specify repository directly
npx upload-git-issues ./issues.csv --repo owner/repository-name

# Dry run - preview without creating issues
npx upload-git-issues ./issues.csv --dry-run

# Verbose output
npx upload-git-issues ./issues.csv --verbose
```

### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `[csv-file]` | Path to CSV file | `./issues.csv` |
| `-t, --token <token>` | GitHub Personal Access Token | `--token ghp_abc123...` |
| `-r, --repo <repo>` | Repository in owner/repo format | `--repo microsoft/vscode` |
| `-o, --owner <owner>` | Repository owner | `--owner microsoft` |
| `-n, --name <name>` | Repository name | `--name vscode` |
| `--dry-run` | Preview issues without creating | `--dry-run` |
| `--verbose` | Enable detailed logging | `--verbose` |
| `-h, --help` | Show help information | `--help` |
| `-v, --version` | Show version number | `--version` |

## 📊 CSV Format

The tool automatically detects and maps common CSV column names. Here are the supported mappings:

### Required Fields

| CSV Column Names | GitHub Field | Description |
|------------------|--------------|-------------|
| `Title`, `title`, `TITLE`, `Name`, `name` | **title** | Issue title (required) |

### Optional Fields

| CSV Column Names | GitHub Field | Description |
|------------------|--------------|-------------|
| `Description`, `Body`, `Content` | **body** | Issue description/content |
| `Labels`, `Tags`, `Label` | **labels** | Comma-separated labels |
| `Assignee`, `Assignees`, `Assigned` | **assignees** | Comma-separated usernames |
| `Milestone`, `Project Milestone`, `Sprint` | **milestone** | Milestone name |
| `Priority` | **labels** | Converted to `priority: {value}` label |
| `Status`, `State` | **labels** | Converted to `status: {value}` label |
| `Due Date`, `Deadline` | **body** | Added to description |

### Example CSV

```csv
Title,Description,Labels,Assignee,Priority,Status,Due Date
"Fix login bug","Users cannot log in with special characters","bug,urgent","johndoe","High","In Progress","2024-01-15"
"Add dark mode","Implement dark theme for better UX","enhancement,ui","janedoe,bobsmith","Medium","Todo","2024-02-01"
"Update documentation","Refresh API documentation","docs","johndoe","Low","Backlog",""
```

## 🔑 GitHub Authentication

You'll need a GitHub Personal Access Token with the following permissions:

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
4. Copy the generated token

The tool will prompt you for the token if not provided via the `--token` option.

## 🎯 Interactive Workflow

When you run the tool, it will guide you through:

1. **CSV File Selection**: Choose your CSV file (if not specified)
2. **GitHub Authentication**: Enter your Personal Access Token
3. **Repository Selection**: Choose from your available repositories
4. **Data Validation**: Automatic validation with helpful error messages
5. **Confirmation**: Review and confirm before creating issues
6. **Progress Tracking**: Real-time progress with beautiful indicators
7. **Results Summary**: Direct links to all created issues

## 🛠️ Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/upload-git-issues.git
cd upload-git-issues

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev path/to/test.csv

# Run tests
npm test
```

### Project Structure

```
src/
├── commands/
│   └── upload.ts          # Main upload command logic
├── services/
│   └── github.ts          # GitHub API integration
├── utils/
│   ├── csv-parser.ts      # CSV parsing utilities
│   └── validators.ts      # Data validation
├── types/
│   └── index.ts           # TypeScript type definitions
└── index.ts               # CLI entry point
```

## 🚨 Error Handling

The tool provides comprehensive error handling for common scenarios:

- **Invalid CSV format**: Clear messages about parsing errors
- **Missing required fields**: Specific field validation errors
- **GitHub API errors**: Authentication and permission issues
- **Rate limiting**: Automatic delays to respect GitHub limits
- **Network issues**: Retry logic and helpful error messages

## 📝 Examples

### Example 1: Linear Export

If you're migrating from Linear, your CSV might look like:

```csv
ID,Title,Description,Status,Priority,Assignee,Labels
LIN-1,"Setup CI/CD","Configure GitHub Actions","In Progress","High","johndoe","devops,ci"
LIN-2,"Fix mobile layout","Responsive design issues","Todo","Medium","janedoe","bug,mobile"
```

### Example 2: Jira Export

For Jira exports:

```csv
Issue Key,Summary,Description,Status,Priority,Assignee,Labels
PROJ-123,"User Authentication","Implement OAuth flow","In Progress","High","john.doe","backend,security"
PROJ-124,"UI Improvements","Update button styles","Open","Low","jane.smith","frontend,ui"
```

### Example 3: Simple Task List

Basic task list format:

```csv
Task,Description,Priority,Assigned To
"Setup database","Create PostgreSQL schema","High","developer1"
"Write tests","Add unit tests for API","Medium","developer2"
"Deploy staging","Setup staging environment","Low","devops"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚖️ Legal Disclaimer

**IMPORTANT**: By using this tool, you acknowledge that:

- **YOU** are solely responsible for ensuring the security and safety of your files
- **YOU** must verify that any CSV files do not contain sensitive or confidential information  
- **YOU** are responsible for verifying the security of any tools you use
- **YOU** should review the source code and run security audits before use
- **YOU** must ensure proper authorization for GitHub API usage and repository access

This software is provided "AS IS" without warranties. See [DISCLAIMER.md](DISCLAIMER.md) for complete legal terms.

**🔒 Security Recommendation**: Always review your CSV data and test with non-sensitive information first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js/) for CLI interface
- Uses [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for interactive prompts
- Powered by [Octokit](https://github.com/octokit/octokit.js) for GitHub API
- Beautiful terminal UI with [Chalk](https://github.com/chalk/chalk) and [Ora](https://github.com/sindresorhus/ora)

---

Made with ❤️ for developers who love automation
