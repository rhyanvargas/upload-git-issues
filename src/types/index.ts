export interface IssueData {
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  milestone?: string;
}

export interface UploadOptions {
  token?: string;
  repo?: string;
  owner?: string;
  name?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface GitHubRepository {
  owner: string;
  repo: string;
}

export interface CreatedIssue {
  number: number;
  title: string;
  html_url: string;
}

export interface CsvRow {
  [key: string]: string | undefined;
}
