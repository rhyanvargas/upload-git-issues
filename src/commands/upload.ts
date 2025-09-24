import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { Octokit } from '@octokit/rest';
import { parseCsvFile } from '../utils/csv-parser.js';
import { validateCsvData } from '../utils/validators.js';
import { createGitHubIssues } from '../services/github.js';
import { IssueData, UploadOptions } from '../types/index.js';
import { 
  validateSafeFilePath, 
  sanitizeGitHubToken, 
  performSecurityAudit,
  logSecurityEvent,
  maskSensitiveData 
} from '../utils/security.js';

export async function uploadCsvToGitHub(csvFile?: string, options: UploadOptions = {}) {
  console.log(chalk.blue.bold('🚀 GitHub Issues CSV Uploader\n'));

  // Legal disclaimer
  if (!options.token && !csvFile) {
    console.log(chalk.yellow.bold('⚖️  IMPORTANT DISCLAIMER'));
    console.log(chalk.yellow('By using this tool, you acknowledge that YOU are responsible for:'));
    console.log(chalk.yellow('• Ensuring the security and safety of your files'));
    console.log(chalk.yellow('• Verifying this tool meets your security requirements'));
    console.log(chalk.yellow('• Proper authorization for GitHub API usage'));
    console.log(chalk.gray('See DISCLAIMER.md for complete legal terms.\n'));
  }

  // Security audit
  performSecurityAudit({ csvFile, token: options.token, verbose: options.verbose });

  // Step 1: Get CSV file path
  const csvPath = await getCsvFilePath(csvFile);
  
  // Step 2: Parse and validate CSV
  const spinner = ora('Parsing CSV file...').start();
  let issuesData: IssueData[];
  
  try {
    issuesData = await parseCsvFile(csvPath);
    validateCsvData(issuesData);
    spinner.succeed(`Parsed ${issuesData.length} issues from CSV`);
  } catch (error) {
    spinner.fail('Failed to parse CSV file');
    throw error;
  }

  // Step 3: Get GitHub token
  const token = await getGitHubToken(options.token);
  
  // Step 4: Initialize GitHub client and get repository info
  const octokit = new Octokit({ auth: token });
  const { owner, repo } = await getRepositoryInfo(octokit, options);

  // Step 5: Preview issues (if dry run) or confirm upload
  if (options.dryRun) {
    previewIssues(issuesData, owner, repo);
    return;
  }

  const shouldProceed = await confirmUpload(issuesData.length, owner, repo);
  if (!shouldProceed) {
    console.log(chalk.yellow('Upload cancelled.'));
    return;
  }

  // Step 6: Create issues
  console.log(chalk.blue('\n📝 Creating GitHub issues...\n'));
  const createdIssues = await createGitHubIssues(octokit, owner, repo, issuesData, options.verbose);

  // Step 7: Show results
  showResults(createdIssues, owner, repo);
}

async function getCsvFilePath(csvFile?: string): Promise<string> {
  if (csvFile) {
    const resolvedPath = path.resolve(csvFile);
    
    // Security validation
    const validation = validateSafeFilePath(resolvedPath);
    if (!validation.safe) {
      logSecurityEvent('File validation failed', { path: maskSensitiveData(resolvedPath, 'url'), reason: validation.reason });
      throw new Error(`Security validation failed: ${validation.reason}`);
    }
    
    logSecurityEvent('File access granted', { path: maskSensitiveData(resolvedPath, 'url') });
    return resolvedPath;
  }

  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter the path to your CSV file:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Please enter a file path';
        }
        
        const resolvedPath = path.resolve(input.trim());
        const validation = validateSafeFilePath(resolvedPath);
        
        if (!validation.safe) {
          return `Security validation failed: ${validation.reason}`;
        }
        
        return true;
      }
    }
  ]);

  return path.resolve(filePath);
}

async function getGitHubToken(token?: string): Promise<string> {
  if (token) {
    const validation = sanitizeGitHubToken(token);
    if (!validation.valid) {
      logSecurityEvent('Token validation failed', { reason: validation.reason });
      throw new Error(`Invalid GitHub token: ${validation.reason}`);
    }
    
    logSecurityEvent('Token validated successfully');
    return validation.sanitized!;
  }

  console.log(chalk.yellow('\n🔑 GitHub Authentication Required'));
  console.log('You need a GitHub Personal Access Token with "repo" permissions.');
  console.log('Create one at: https://github.com/settings/tokens\n');

  const { githubToken } = await inquirer.prompt([
    {
      type: 'password',
      name: 'githubToken',
      message: 'Enter your GitHub Personal Access Token:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Please enter your GitHub token';
        }
        
        const validation = sanitizeGitHubToken(input);
        if (!validation.valid) {
          return `Invalid token: ${validation.reason}`;
        }
        
        return true;
      }
    }
  ]);

  return githubToken;
}

async function getRepositoryInfo(octokit: Octokit, options: UploadOptions) {
  // If repo option is provided in owner/repo format
  if (options.repo && options.repo.includes('/')) {
    const [owner, repo] = options.repo.split('/');
    return { owner, repo };
  }

  // If owner and name are provided separately
  if (options.owner && options.name) {
    return { owner: options.owner, repo: options.name };
  }

  // Interactive selection
  console.log(chalk.blue('\n📁 Repository Selection'));
  
  const spinner = ora('Fetching your repositories...').start();
  
  try {
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 50
    });

    spinner.succeed(`Found ${repos.length} repositories`);

    if (repos.length === 0) {
      throw new Error('No repositories found. Please create a repository first.');
    }

    const { selectedRepo } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedRepo',
        message: 'Select a repository to upload issues to:',
        choices: repos.map(repo => ({
          name: `${repo.full_name} ${repo.private ? '(private)' : '(public)'}`,
          value: { owner: repo.owner.login, repo: repo.name }
        })),
        pageSize: 10
      }
    ]);

    return selectedRepo;
  } catch (error) {
    spinner.fail('Failed to fetch repositories');
    throw error;
  }
}

function previewIssues(issues: IssueData[], owner: string, repo: string) {
  console.log(chalk.blue(`\n📋 Preview: ${issues.length} issues for ${owner}/${repo}\n`));
  
  issues.slice(0, 5).forEach((issue, index) => {
    console.log(chalk.green(`${index + 1}. ${issue.title}`));
    if (issue.body) {
      console.log(chalk.gray(`   ${issue.body.substring(0, 100)}${issue.body.length > 100 ? '...' : ''}`));
    }
    if (issue.labels && issue.labels.length > 0) {
      console.log(chalk.cyan(`   Labels: ${issue.labels.join(', ')}`));
    }
    console.log();
  });

  if (issues.length > 5) {
    console.log(chalk.gray(`... and ${issues.length - 5} more issues`));
  }

  console.log(chalk.yellow('\nThis is a dry run. No issues were created.'));
  console.log(chalk.gray('Remove --dry-run flag to create the issues.'));
}

async function confirmUpload(count: number, owner: string, repo: string): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Create ${count} issues in ${owner}/${repo}?`,
      default: false
    }
  ]);

  return confirm;
}

function showResults(createdIssues: Array<{ number: number; title: string; html_url: string }>, owner: string, repo: string) {
  console.log(chalk.green.bold(`\n✅ Successfully created ${createdIssues.length} issues!\n`));
  
  console.log(chalk.blue('📋 Created Issues:'));
  createdIssues.forEach(issue => {
    console.log(chalk.green(`  #${issue.number}: ${issue.title}`));
    console.log(chalk.gray(`  ${issue.html_url}\n`));
  });

  console.log(chalk.blue(`🔗 View all issues: https://github.com/${owner}/${repo}/issues`));
}
