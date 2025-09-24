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

program
  .command('disclaimer')
  .description('Show legal disclaimer and security information')
  .action(() => {
    console.log(chalk.yellow.bold('\n⚖️  LEGAL DISCLAIMER\n'));
    console.log(chalk.yellow('By using this tool, you acknowledge that YOU are responsible for:'));
    console.log(chalk.yellow('• Ensuring the security and safety of your files'));
    console.log(chalk.yellow('• Verifying that CSV files do not contain sensitive information'));
    console.log(chalk.yellow('• Verifying this tool meets your security requirements'));
    console.log(chalk.yellow('• Proper authorization for GitHub API usage and repository access'));
    console.log(chalk.yellow('• Compliance with your organization\'s security policies\n'));
    
    console.log(chalk.red.bold('⚠️  NO WARRANTIES'));
    console.log(chalk.red('This software is provided "AS IS" without any warranties.'));
    console.log(chalk.red('Use at your own risk. See DISCLAIMER.md for complete terms.\n'));
    
    console.log(chalk.blue.bold('🔒 SECURITY RECOMMENDATIONS'));
    console.log(chalk.blue('• Review source code and run security audit before use'));
    console.log(chalk.blue('• Test with non-sensitive data first'));
    console.log(chalk.blue('• Keep GitHub tokens secure and rotate regularly'));
    console.log(chalk.blue('• Monitor API usage and repository access\n'));
    
    console.log(chalk.green('Run `npm run security-audit` to verify tool security.'));
  });

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
