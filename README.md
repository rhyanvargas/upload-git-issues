<h1 align="center">🚀 Upload Git Issues</h1>
<div align="center">
<p align="center">
<a href="https://www.npmjs.com/package/upload-git-issues">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/upload-git-issues/latest.svg">
</a>
</p>
<h4 align="center">Zero-config CLI to bulk upload CSV data to GitHub Issues</h4>
<p align="center">
Perfect for platform migrations - create GitHub Issues from your CSV exports, then use Linear's native GitHub import to sync._
</p>
</div>
<hr/>

## 🚀 Quick Start

```bash
# One command - that's it!
npx upload-git-issues your-file.csv

# With options
npx upload-git-issues issues.csv --dry-run --verbose
```

**What happens:**

1. Interactive prompts guide you through GitHub authentication and repo selection
2. Intelligent CSV parsing (works with Linear exports, Jira exports, any CSV format)
3. Beautiful progress indicators show real-time status
4. Issues created in GitHub - ready for Linear's native GitHub import

### 📄 Sample CSV to Get Started

Create a file called `issues.csv` with this content:

```csv
Title,Description,Labels,Priority,Assignee
"Fix login authentication bug","Users are unable to log in with valid credentials","bug,urgent","High","johndoe"
"Add dark mode toggle","Implement dark/light theme switcher in user settings","enhancement,ui","Medium","janedoe"
"Update API documentation","Refresh the API docs with latest endpoint changes","documentation","Low","techwriter"
"Optimize database queries","Improve performance of user dashboard queries","performance,backend","High","dbadmin"
```

Then run:

```bash
npx upload-git-issues issues.csv --dry-run
```

## 🧪 Local Development & Testing

> **Note**: This tool is currently in pre-release. For local testing and development:

### Method 1: Development Mode (Fastest)

```bash
git clone https://github.com/rhyanvargas/upload-git-issues.git
cd upload-git-issues
npm install
npm run dev -- --help
npm run dev -- example.csv --dry-run
```

### Method 2: Build and Test

```bash
npm run build
npm start -- --help
npm start -- example.csv --dry-run
```

### Method 3: Global Installation Testing (Most Realistic)

```bash
# Link for global testing (does NOT publish live)
npm link

# Test as if installed globally
upload-git-issues --help
upload-git-issues example.csv --dry-run

# Unlink when done testing
npm unlink -g upload-git-issues
```

**⚠️ Important**: `npm link` is safe and local-only. It does NOT publish to npm registry.

> **💡 Tip**: Use the included `example.csv` file for testing, or create your own following the CSV format shown in the Quick Start section above.

## 📋 When to Use This Tool

| **Your Situation**                         | **Use This Tool?**           | **Why**                                               |
| ------------------------------------------ | ---------------------------- | ----------------------------------------------------- |
| **🔄 Migrating to Linear via GitHub**      | ✅ **Perfect Choice**        | Create GitHub Issues, then use Linear's GitHub import |
| **📊 Have CSV data to upload**             | ✅ **Perfect Choice**        | Intelligent parsing handles any CSV format            |
| **⚡ Need it done quickly**                | ✅ **Perfect Choice**        | One command, 2 minutes to complete                    |
| **🏢 Enterprise/Security requirements**    | ✅ **Perfect Choice**        | Built-in security audits and compliance               |
| **👥 Non-technical team member**           | ✅ **Perfect Choice**        | Interactive prompts guide you through                 |
| **🔒 Single repository upload**            | ✅ **Perfect Choice**        | Optimized for this common use case                    |
| **🎯 Creating 5-1000+ issues**             | ✅ **Perfect Choice**        | Handles any volume with progress tracking             |
|                                            |                              |                                                       |
| **🏗️ Multi-repository bulk operations**    | ⚠️ **Consider Alternatives** | Our tool focuses on single repositories               |
| **📝 Complex issue templating needs**      | ⚠️ **Consider Alternatives** | Use tools with Mustache/Liquid support                |
| **🤖 GitHub Actions workflow integration** | ⚠️ **Consider Alternatives** | Look for native CI/CD solutions                       |
| **💬 Adding comments to existing issues**  | ⚠️ **Consider Alternatives** | Our tool creates new issues only                      |
| **⚙️ Highly customized automation**        | ⚠️ **Consider Alternatives** | Use scriptable solutions                              |

## 📋 Options

| Option            | Description                | Example              |
| ----------------- | -------------------------- | -------------------- |
| `[csv-file]`      | Path to CSV file           | `./issues.csv`       |
| `--dry-run`       | Preview without creating   | `--dry-run`          |
| `--verbose`       | Detailed logging           | `--verbose`          |
| `--token <token>` | GitHub token (skip prompt) | `--token ghp_abc123` |
| `--repo <repo>`   | Target repository          | `--repo owner/repo`  |

## 📊 CSV Format

**Required:** `Title` column  
**Optional:** `Description`, `Labels`, `Assignee`, `Priority`, `Status`, etc.

```csv
Title,Description,Labels,Assignee,Priority
"Fix login bug","Users cannot log in","bug,urgent","johndoe","High"
"Add dark mode","Implement dark theme","enhancement,ui","janedoe","Medium"
```

The tool intelligently maps column names (Title/title/TITLE all work) and converts Priority/Status to labels.

> **💡 Linear Migration Tip:** After creating GitHub Issues, use Linear's native GitHub import feature to sync them into your Linear workspace.

## 🔑 GitHub Authentication

Create a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope. The tool will prompt you for it.

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

---

Made with ❤️ for developers who love automation
