# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-24

### Added
- **Core Features**
  - Zero-config CLI tool for bulk CSV to GitHub Issues upload
  - Interactive prompts for GitHub authentication and repository selection
  - Flexible CSV parsing with automatic column mapping
  - Support for titles, descriptions, labels, assignees, milestones, and due dates
  - Beautiful terminal UI with progress indicators using Ora and Chalk
  - Dry run mode for previewing issues before creation
  - Verbose logging option for detailed operation tracking

- **Security Features**
  - Comprehensive file system security with path traversal protection
  - GitHub token validation and sanitization
  - CSV injection protection and data sanitization
  - Network request validation (HTTPS-only, whitelisted domains)
  - Sensitive data masking in logs
  - Automated security audit tooling
  - File size limits (50MB max) and type validation (.csv only)

- **Legal Protection**
  - Comprehensive legal disclaimer (DISCLAIMER.md)
  - User responsibility framework for file and tool security
  - "AS IS" software warranty disclaimer
  - Liability limitation clauses
  - CLI disclaimer command for easy access to legal terms

- **Documentation**
  - Detailed README with usage examples and CSV format guide
  - Security documentation (SECURITY.md) with audit procedures
  - Quick start guide (QUICKSTART.md)
  - Example CSV files for testing

- **Developer Tools**
  - TypeScript with ES modules configuration
  - Automated security audit script
  - CSV parser testing utility
  - Comprehensive error handling and validation
  - Git workflow with feature branches

### Technical Details
- **Dependencies**: Uses only trusted, well-known npm packages
- **Architecture**: Modular TypeScript design with clear separation of concerns
- **Security**: Multiple layers of validation and sanitization
- **Testing**: Automated security audits and parser validation
- **Compatibility**: Node.js 16+ required

### Usage
```bash
# Install and use
npx upload-git-issues path/to/file.csv

# View security information
npx upload-git-issues disclaimer

# Run security audit
npm run security-audit
```

### Security Guarantees
- ✅ Read-only file system access (CSV files only)
- ✅ HTTPS-only requests to GitHub API
- ✅ No sensitive data logging or storage
- ✅ Input validation and sanitization
- ✅ No malicious code or backdoors
- ✅ Trusted dependencies only
