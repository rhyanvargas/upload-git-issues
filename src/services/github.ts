import { Octokit } from '@octokit/rest';
import ora from 'ora';
import chalk from 'chalk';
import { IssueData } from '../types/index.js';

interface CreatedIssue {
  number: number;
  title: string;
  html_url: string;
}

export async function createGitHubIssues(
  octokit: Octokit,
  owner: string,
  repo: string,
  issues: IssueData[],
  verbose = false
): Promise<CreatedIssue[]> {
  const createdIssues: CreatedIssue[] = [];
  const spinner = ora();
  
  // Get existing milestones and labels for validation
  const { existingMilestones, existingLabels } = await getRepositoryMetadata(octokit, owner, repo);

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const progress = `(${i + 1}/${issues.length})`;
    
    spinner.start(`Creating issue ${progress}: ${issue.title}`);

    try {
      // Prepare issue data
      const issueData: any = {
        owner,
        repo,
        title: issue.title,
        body: issue.body || ''
      };

      // Handle labels
      if (issue.labels && issue.labels.length > 0) {
        // Filter out labels that don't exist (GitHub will create them automatically)
        issueData.labels = issue.labels;
      }

      // Handle assignees
      if (issue.assignees && issue.assignees.length > 0) {
        // Validate assignees exist (optional - GitHub will ignore invalid ones)
        issueData.assignees = issue.assignees;
      }

      // Handle milestone
      if (issue.milestone) {
        const milestone = existingMilestones.find(m => 
          m.title.toLowerCase() === issue.milestone!.toLowerCase()
        );
        
        if (milestone) {
          issueData.milestone = milestone.number;
        } else if (verbose) {
          console.warn(chalk.yellow(`Warning: Milestone "${issue.milestone}" not found in repository`));
        }
      }

      // Create the issue
      const response = await octokit.rest.issues.create(issueData);
      
      createdIssues.push({
        number: response.data.number,
        title: response.data.title,
        html_url: response.data.html_url
      });

      spinner.succeed(`Created issue ${progress}: #${response.data.number} ${issue.title}`);

      if (verbose) {
        console.log(chalk.gray(`  URL: ${response.data.html_url}`));
      }

      // Rate limiting: GitHub allows 5000 requests per hour for authenticated users
      // Add a small delay to be respectful
      if (i < issues.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

    } catch (error) {
      spinner.fail(`Failed to create issue ${progress}: ${issue.title}`);
      
      if (error instanceof Error) {
        console.error(chalk.red(`  Error: ${error.message}`));
        
        // Handle specific GitHub API errors
        if ('status' in error) {
          const status = (error as any).status;
          switch (status) {
            case 401:
              throw new Error('Authentication failed. Please check your GitHub token.');
            case 403:
              throw new Error('Access forbidden. Make sure your token has "repo" permissions.');
            case 404:
              throw new Error(`Repository ${owner}/${repo} not found or you don't have access.`);
            case 422:
              console.error(chalk.red('  This might be due to invalid assignees or other validation errors.'));
              break;
          }
        }
      }
      
      // Continue with other issues instead of stopping completely
      continue;
    }
  }

  return createdIssues;
}

async function getRepositoryMetadata(octokit: Octokit, owner: string, repo: string) {
  const existingMilestones: Array<{ number: number; title: string }> = [];
  const existingLabels: Array<{ name: string; color: string }> = [];

  try {
    // Get milestones
    const milestonesResponse = await octokit.rest.issues.listMilestones({
      owner,
      repo,
      state: 'all'
    });
    existingMilestones.push(...milestonesResponse.data.map(m => ({
      number: m.number,
      title: m.title
    })));

    // Get labels
    const labelsResponse = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo
    });
    existingLabels.push(...labelsResponse.data.map(l => ({
      name: l.name,
      color: l.color
    })));

  } catch (error) {
    // If we can't fetch metadata, continue without it
    console.warn(chalk.yellow('Warning: Could not fetch repository metadata for validation'));
  }

  return { existingMilestones, existingLabels };
}

export async function validateGitHubAccess(octokit: Octokit, owner: string, repo: string): Promise<void> {
  try {
    // Test repository access
    await octokit.rest.repos.get({ owner, repo });
    
    // Test if we can create issues (check permissions)
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    
    if (!repoData.permissions?.push && !repoData.permissions?.admin) {
      throw new Error(`Insufficient permissions to create issues in ${owner}/${repo}. You need push or admin access.`);
    }
    
  } catch (error) {
    if (error instanceof Error) {
      if ('status' in error) {
        const status = (error as any).status;
        switch (status) {
          case 401:
            throw new Error('Authentication failed. Please check your GitHub token.');
          case 403:
            throw new Error('Access forbidden. Make sure your token has "repo" permissions.');
          case 404:
            throw new Error(`Repository ${owner}/${repo} not found or you don't have access.`);
          default:
            throw new Error(`GitHub API error: ${error.message}`);
        }
      }
      throw error;
    }
    throw new Error('Unknown error validating GitHub access');
  }
}
