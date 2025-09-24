# 🚀 Upload Git Issues v1.0.0

**Zero-config CLI to bulk upload CSV data to GitHub Issues**

Perfect for platform migrations - create GitHub Issues from your CSV exports, then use Linear's native GitHub import to sync.

## ✨ What's New

### 🎯 **Core Features**
- **Zero Configuration** - Works immediately with `npx upload-git-issues your-file.csv`
- **Interactive CLI** - Beautiful terminal interface guides you through the process
- **Intelligent CSV Parsing** - Automatically maps common column names (Title/title/TITLE all work)
- **Platform Migration Ready** - Perfect for Linear, Jira, Asana exports
- **Dry Run Mode** - Preview issues before creating them with `--dry-run`
- **Progress Tracking** - Real-time progress indicators with direct links to created issues

### 🛡️ **Enterprise Security**
- **Comprehensive Security Audit** - Built-in security validation and reporting
- **File System Protection** - Read-only access with path traversal prevention
- **GitHub Token Security** - Validation, sanitization, and secure handling
- **CSV Injection Protection** - Sanitizes all input data
- **Network Security** - HTTPS-only requests to whitelisted domains
- **Legal Compliance** - Complete disclaimer and user responsibility framework

### 💎 **Developer Experience**
- **TypeScript** - Full type safety and IntelliSense support
- **ES Modules** - Modern JavaScript standards
- **Comprehensive Error Handling** - Clear, actionable error messages
- **Flexible Options** - Support for tokens, repositories, verbose logging
- **Security Transparency** - `disclaimer` command shows all legal terms

## 🚀 Quick Start

```bash
# One command - that's it!
npx upload-git-issues your-file.csv

# With options
npx upload-git-issues issues.csv --dry-run --verbose --token ghp_your_token
```

## 📊 CSV Format Support

Works with any CSV format. Intelligent column mapping supports:

**Required:** `Title` column  
**Optional:** `Description`, `Labels`, `Assignee`, `Priority`, `Status`, etc.

```csv
Title,Description,Labels,Assignee,Priority
"Fix login bug","Users cannot log in","bug,urgent","johndoe","High"
"Add dark mode","Implement dark theme","enhancement,ui","janedoe","Medium"
```

## 🔄 Migration Workflow

1. **Export** your data from Linear/Jira/etc. as CSV
2. **Run** `npx upload-git-issues your-export.csv`
3. **Use Linear's GitHub import** to sync the created GitHub Issues

## 🛡️ Security Guarantees

- ✅ **Read-only file system access** (CSV files only)
- ✅ **HTTPS-only requests** to GitHub API
- ✅ **No sensitive data logging** or storage
- ✅ **Input validation** and sanitization
- ✅ **No malicious code** or backdoors
- ✅ **Trusted dependencies** only

Run `npm run security-audit` to verify tool security.

## 📦 Installation

```bash
# Use directly (recommended)
npx upload-git-issues@latest your-file.csv

# Or install globally
npm install -g upload-git-issues
upload-git-issues your-file.csv
```

## 🔑 GitHub Authentication

Create a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope. The tool will prompt you for it.

## 📋 Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `[csv-file]` | Path to CSV file | `./issues.csv` |
| `--dry-run` | Preview without creating | `--dry-run` |
| `--verbose` | Detailed logging | `--verbose` |
| `--token <token>` | GitHub token (skip prompt) | `--token ghp_abc123` |
| `--repo <repo>` | Target repository | `--repo owner/repo` |

## 🎯 When to Use This Tool

✅ **Perfect for:**
- Migrating to Linear via GitHub
- Bulk CSV uploads to GitHub Issues  
- Enterprise environments requiring security compliance
- Non-technical team members needing guided experience
- Quick tasks requiring immediate results

⚠️ **Consider alternatives for:**
- Multi-repository bulk operations
- Complex issue templating needs
- GitHub Actions workflow integration

## 🔗 Links

- **npm Package**: https://www.npmjs.com/package/upload-git-issues
- **GitHub Repository**: https://github.com/rhyanvargas/upload-git-issues
- **Documentation**: See README.md for complete documentation
- **Security Policy**: See SECURITY.md for security details
- **Legal Terms**: See DISCLAIMER.md for complete legal terms

## 🙏 Acknowledgments

Built with modern tools for reliability and security:
- TypeScript for type safety
- Commander.js for CLI interface
- Inquirer.js for interactive prompts
- Octokit for GitHub API integration
- Chalk & Ora for beautiful terminal UI

## 📈 What's Next

Future versions may include:
- GitHub Actions integration
- Additional platform support
- Enhanced CSV format detection
- Bulk operations across repositories

---

**Made with ❤️ for developers who love automation**

*This release has been security audited and is safe for enterprise use.*
