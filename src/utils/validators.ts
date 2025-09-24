import { IssueData } from '../types/index.js';

export function validateCsvData(issues: IssueData[]): void {
  if (!Array.isArray(issues)) {
    throw new Error('Invalid CSV data: Expected an array of issues');
  }

  if (issues.length === 0) {
    throw new Error('No valid issues found in CSV file');
  }

  // Validate each issue
  issues.forEach((issue, index) => {
    validateIssue(issue, index + 1);
  });

  console.log(`✅ Validated ${issues.length} issues`);
}

function validateIssue(issue: IssueData, rowNumber: number): void {
  const prefix = `Row ${rowNumber}:`;

  // Title is required
  if (!issue.title || typeof issue.title !== 'string' || issue.title.trim().length === 0) {
    throw new Error(`${prefix} Title is required and must be a non-empty string`);
  }

  // Title length check (GitHub limit is 256 characters)
  if (issue.title.length > 256) {
    throw new Error(`${prefix} Title is too long (max 256 characters). Current: ${issue.title.length}`);
  }

  // Body length check (GitHub has a practical limit)
  if (issue.body && issue.body.length > 65536) {
    throw new Error(`${prefix} Description is too long (max 65,536 characters). Current: ${issue.body.length}`);
  }

  // Validate labels
  if (issue.labels) {
    if (!Array.isArray(issue.labels)) {
      throw new Error(`${prefix} Labels must be an array`);
    }

    issue.labels.forEach((label, labelIndex) => {
      if (typeof label !== 'string' || label.trim().length === 0) {
        throw new Error(`${prefix} Label ${labelIndex + 1} must be a non-empty string`);
      }

      // GitHub label name restrictions
      if (label.length > 50) {
        throw new Error(`${prefix} Label "${label}" is too long (max 50 characters)`);
      }

      // Labels cannot start or end with spaces (we trim them, but warn about it)
      if (label !== label.trim()) {
        console.warn(`Warning: ${prefix} Label "${label}" has leading/trailing spaces that will be trimmed`);
      }
    });

    // Remove duplicates and trim labels
    issue.labels = [...new Set(issue.labels.map(label => label.trim()))];

    // GitHub has a limit of 100 labels per issue
    if (issue.labels.length > 100) {
      throw new Error(`${prefix} Too many labels (max 100). Current: ${issue.labels.length}`);
    }
  }

  // Validate assignees
  if (issue.assignees) {
    if (!Array.isArray(issue.assignees)) {
      throw new Error(`${prefix} Assignees must be an array`);
    }

    issue.assignees.forEach((assignee, assigneeIndex) => {
      if (typeof assignee !== 'string' || assignee.trim().length === 0) {
        throw new Error(`${prefix} Assignee ${assigneeIndex + 1} must be a non-empty string`);
      }

      // GitHub username restrictions (basic validation)
      const username = assignee.trim();
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(username)) {
        console.warn(`Warning: ${prefix} Assignee "${username}" may not be a valid GitHub username`);
      }

      if (username.length > 39) {
        throw new Error(`${prefix} Assignee "${username}" is too long (max 39 characters)`);
      }
    });

    // Remove duplicates and trim assignees
    issue.assignees = [...new Set(issue.assignees.map(assignee => assignee.trim()))];

    // GitHub has a limit of 10 assignees per issue
    if (issue.assignees.length > 10) {
      throw new Error(`${prefix} Too many assignees (max 10). Current: ${issue.assignees.length}`);
    }
  }

  // Validate milestone
  if (issue.milestone) {
    if (typeof issue.milestone !== 'string' || issue.milestone.trim().length === 0) {
      throw new Error(`${prefix} Milestone must be a non-empty string`);
    }

    issue.milestone = issue.milestone.trim();
  }
}

export function validateGitHubToken(token: string): boolean {
  // Basic GitHub token validation
  if (!token || typeof token !== 'string') {
    return false;
  }

  // GitHub personal access tokens start with 'ghp_' (new format) or are 40 characters (classic)
  const isNewFormat = token.startsWith('ghp_') && token.length >= 36;
  const isClassicFormat = /^[a-f0-9]{40}$/.test(token);
  
  return isNewFormat || isClassicFormat;
}

export function validateRepositoryName(repo: string): boolean {
  // GitHub repository name validation
  if (!repo || typeof repo !== 'string') {
    return false;
  }

  // Repository name can contain alphanumeric characters, hyphens, underscores, and periods
  // Cannot start with a period, hyphen, or underscore
  // Cannot end with a period
  const repoRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
  
  return repoRegex.test(repo) && repo.length <= 100;
}
