import fs from 'fs';
import csv from 'csv-parser';
import { IssueData } from '../types/index.js';
import { sanitizeCsvData } from './security.js';

export function parseCsvFile(filePath: string): Promise<IssueData[]> {
  return new Promise((resolve, reject) => {
    const issues: IssueData[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const issue = parseRowToIssue(row);
          if (issue) {
            issues.push(issue);
          }
        } catch (error) {
          reject(new Error(`Error parsing row: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      })
      .on('end', () => {
        resolve(issues);
      })
      .on('error', (error) => {
        reject(new Error(`Error reading CSV file: ${error.message}`));
      });
  });
}

function parseRowToIssue(row: any): IssueData | null {
  // Skip empty rows
  if (!row.Title && !row.title) {
    return null;
  }

  // Map common CSV column names to issue properties (with sanitization)
  const title = sanitizeCsvData(row.Title || row.title || row.TITLE || row.name || row.Name || row.NAME);
  const body = sanitizeCsvData(row.Description || row.description || row.DESCRIPTION || 
               row.Body || row.body || row.BODY || 
               row.Content || row.content || row.CONTENT || '');

  if (!title) {
    throw new Error('Title is required for each issue');
  }

  const issue: IssueData = {
    title: String(title).trim(),
    body: body ? String(body).trim() : undefined
  };

  // Parse labels
  const labelsField = row.Labels || row.labels || row.LABELS || 
                     row.Tags || row.tags || row.TAGS ||
                     row.Label || row.label || row.LABEL;
  
  if (labelsField) {
    const labelsStr = String(labelsField).trim();
    if (labelsStr) {
      // Split by comma, semicolon, or pipe and clean up
      issue.labels = labelsStr
        .split(/[,;|]/)
        .map(label => label.trim())
        .filter(label => label.length > 0);
    }
  }

  // Parse assignees
  const assigneeField = row.Assignee || row.assignee || row.ASSIGNEE ||
                       row.Assignees || row.assignees || row.ASSIGNEES ||
                       row.Assigned || row.assigned || row.ASSIGNED;
  
  if (assigneeField) {
    const assigneeStr = String(assigneeField).trim();
    if (assigneeStr) {
      // Split by comma and clean up, remove email domains if present
      issue.assignees = assigneeStr
        .split(',')
        .map(assignee => {
          const cleaned = assignee.trim();
          // Remove email domain if it looks like an email
          if (cleaned.includes('@')) {
            return cleaned.split('@')[0];
          }
          return cleaned;
        })
        .filter(assignee => assignee.length > 0);
    }
  }

  // Parse milestone
  const milestoneField = row.Milestone || row.milestone || row.MILESTONE ||
                        row['Project Milestone'] || row['project milestone'] ||
                        row.Sprint || row.sprint || row.SPRINT;
  
  if (milestoneField) {
    const milestoneStr = String(milestoneField).trim();
    if (milestoneStr && milestoneStr !== 'undefined' && milestoneStr !== 'null') {
      issue.milestone = milestoneStr;
    }
  }

  // Parse priority (convert to label if present)
  const priorityField = row.Priority || row.priority || row.PRIORITY;
  if (priorityField) {
    const priorityStr = String(priorityField).trim().toLowerCase();
    if (priorityStr && priorityStr !== 'no priority' && priorityStr !== 'none') {
      if (!issue.labels) {
        issue.labels = [];
      }
      // Add priority as a label with consistent naming
      const priorityLabel = `priority: ${priorityStr}`;
      if (!issue.labels.includes(priorityLabel)) {
        issue.labels.push(priorityLabel);
      }
    }
  }

  // Parse status (convert to label if present)
  const statusField = row.Status || row.status || row.STATUS || row.State || row.state;
  if (statusField) {
    const statusStr = String(statusField).trim().toLowerCase();
    if (statusStr && statusStr !== 'undefined' && statusStr !== 'null') {
      if (!issue.labels) {
        issue.labels = [];
      }
      // Add status as a label
      const statusLabel = `status: ${statusStr}`;
      if (!issue.labels.includes(statusLabel)) {
        issue.labels.push(statusLabel);
      }
    }
  }

  // Parse due date and add to body if present
  const dueDateField = row['Due Date'] || row['due date'] || row.DueDate || 
                      row.duedate || row.deadline || row.Deadline;
  
  if (dueDateField) {
    const dueDateStr = String(dueDateField).trim();
    if (dueDateStr && dueDateStr !== 'undefined' && dueDateStr !== 'null') {
      const dueDate = new Date(dueDateStr);
      if (!isNaN(dueDate.getTime())) {
        const formattedDate = dueDate.toLocaleDateString();
        if (issue.body) {
          issue.body += `\n\n**Due Date:** ${formattedDate}`;
        } else {
          issue.body = `**Due Date:** ${formattedDate}`;
        }
      }
    }
  }

  return issue;
}
