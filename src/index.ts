#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { uploadCsvToGitHub } from './commands/upload.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

const program = new Command();

program
  .name('upload-git-issues')
  .description('A zero-config CLI tool to bulk upload CSV data to GitHub Issues')
  .version(version);

program
  .argument('[csv-file]', 'Path to the CSV file containing issue data')
  .option('-t, --token <token>', 'GitHub personal access token')
  .option('-r, --repo <repo>', 'GitHub repository in format owner/repo')
  .option('-o, --owner <owner>', 'GitHub repository owner')
  .option('-n, --name <name>', 'GitHub repository name')
  .option('--dry-run', 'Preview issues without creating them')
  .option('--verbose', 'Enable verbose logging')
  .action(async (csvFile, options) => {
    try {
      await uploadCsvToGitHub(csvFile, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('help')
  .description('Show help information')
  .action(() => {
    program.help();
  });

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
