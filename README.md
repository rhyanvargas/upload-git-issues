# 🚀 Upload Git Issues

**Zero-config CLI to bulk upload CSV data to GitHub Issues**

Perfect for Linear/Jira migrations - works with any CSV format, no setup required.

## 🚀 Quick Start

```bash
# One command - that's it!
npx upload-git-issues your-file.csv

# With options
npx upload-git-issues issues.csv --dry-run --verbose
```

**What happens:**
1. Interactive prompts guide you through authentication and repo selection
2. Intelligent CSV parsing (works with Linear, Jira, any format)
3. Beautiful progress indicators show real-time status
4. Direct links to all created issues

## 📋 When to Use This Tool

| **Your Situation**                         | **Use This Tool?**           | **Why**                                       |
| ------------------------------------------ | ---------------------------- | --------------------------------------------- |
| **🔄 Migrating from Linear/Jira/Asana**    | ✅ **Perfect Choice**        | Works with exports out-of-the-box, zero setup |
| **📊 Have CSV data to upload**             | ✅ **Perfect Choice**        | Intelligent parsing handles any CSV format    |
| **⚡ Need it done quickly**                | ✅ **Perfect Choice**        | One command, 2 minutes to complete            |
| **🏢 Enterprise/Security requirements**    | ✅ **Perfect Choice**        | Built-in security audits and compliance       |
| **👥 Non-technical team member**           | ✅ **Perfect Choice**        | Interactive prompts guide you through         |
| **🔒 Single repository upload**            | ✅ **Perfect Choice**        | Optimized for this common use case            |
| **🎯 Creating 5-1000+ issues**             | ✅ **Perfect Choice**        | Handles any volume with progress tracking     |
|                                            |                              |                                               |
| **🏗️ Multi-repository bulk operations**    | ⚠️ **Consider Alternatives** | Our tool focuses on single repositories       |
| **📝 Complex issue templating needs**      | ⚠️ **Consider Alternatives** | Use tools with Mustache/Liquid support        |
| **🤖 GitHub Actions workflow integration** | ⚠️ **Consider Alternatives** | Look for native CI/CD solutions               |
| **💬 Adding comments to existing issues**  | ⚠️ **Consider Alternatives** | Our tool creates new issues only              |
| **⚙️ Highly customized automation**        | ⚠️ **Consider Alternatives** | Use scriptable solutions                      |

## 📋 Options

| Option | Description | Example |
|--------|-------------|---------|
| `[csv-file]` | Path to CSV file | `./issues.csv` |
| `--dry-run` | Preview without creating | `--dry-run` |
| `--verbose` | Detailed logging | `--verbose` |
| `--token <token>` | GitHub token (skip prompt) | `--token ghp_abc123` |
| `--repo <repo>` | Target repository | `--repo owner/repo` |

## 📊 CSV Format

**Required:** `Title` column  
**Optional:** `Description`, `Labels`, `Assignee`, `Priority`, `Status`, etc.

```csv
Title,Description,Labels,Assignee,Priority
"Fix login bug","Users cannot log in","bug,urgent","johndoe","High"
"Add dark mode","Implement dark theme","enhancement,ui","janedoe","Medium"
```

The tool intelligently maps column names (Title/title/TITLE all work) and converts Priority/Status to labels.

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
