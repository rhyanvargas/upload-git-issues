# 🚀 Quick Start Guide

## Test the CLI Tool

1. **Test with the example CSV (dry run):**
   ```bash
   npm run dev example.csv --dry-run
   ```

2. **Test with your Linear export:**
   ```bash
   npm run dev "/Users/rhyanvargas/Downloads/Export Wed Sep 24 2025.csv" --dry-run
   ```

3. **Install globally and use:**
   ```bash
   npm install -g .
   upload-git-issues example.csv --dry-run
   ```

4. **Use with npx (recommended for distribution):**
   ```bash
   npx . example.csv --dry-run
   ```

## GitHub Token Setup

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (Full control of private repositories)
4. Copy the token and use it when prompted

## Example Commands

```bash
# Interactive mode (prompts for everything)
upload-git-issues

# Specify CSV file
upload-git-issues ./issues.csv

# With token (skip auth prompt)
upload-git-issues ./issues.csv --token ghp_your_token

# Specify repository
upload-git-issues ./issues.csv --repo owner/repo-name

# Dry run (preview only)
upload-git-issues ./issues.csv --dry-run

# Verbose output
upload-git-issues ./issues.csv --verbose
```

## CSV Format Examples

### Your Linear Export Format ✅
```csv
ID,Team,Title,Description,Status,Priority,Assignee,Labels
RHY-5,Rhyan,"Apply to 5 jobs",,"In Progress","Urgent","hello@rhyan.dev","Apply"
```

### Simple Format ✅
```csv
Title,Description,Labels,Priority
"Setup CI/CD","Configure GitHub Actions","devops,ci","High"
"Fix bug","Mobile layout issue","bug,mobile","Medium"
```

### Jira Export Format ✅
```csv
Issue Key,Summary,Description,Status,Priority,Assignee
PROJ-123,"User Auth","Implement OAuth","In Progress","High","john.doe"
```

## Publishing to npm

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Test locally:**
   ```bash
   npm pack
   npm install -g upload-git-issues-1.0.0.tgz
   ```

3. **Publish to npm:**
   ```bash
   npm publish
   ```

4. **Use globally:**
   ```bash
   npx upload-git-issues path/to/file.csv
   ```
