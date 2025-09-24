#!/usr/bin/env node

// Simple test script to verify CSV parsing without GitHub authentication
import { parseCsvFile } from './dist/utils/csv-parser.js';
import { validateCsvData } from './dist/utils/validators.js';
import chalk from 'chalk';

async function testParser(csvFile) {
  try {
    console.log(chalk.blue.bold('🧪 Testing CSV Parser\n'));
    
    console.log(chalk.gray(`Parsing: ${csvFile}`));
    const issues = await parseCsvFile(csvFile);
    
    console.log(chalk.green(`✅ Parsed ${issues.length} issues\n`));
    
    validateCsvData(issues);
    
    // Display parsed issues
    issues.forEach((issue, index) => {
      console.log(chalk.cyan(`${index + 1}. ${issue.title}`));
      if (issue.body) {
        console.log(chalk.gray(`   ${issue.body.substring(0, 100)}${issue.body.length > 100 ? '...' : ''}`));
      }
      if (issue.labels && issue.labels.length > 0) {
        console.log(chalk.yellow(`   Labels: ${issue.labels.join(', ')}`));
      }
      if (issue.assignees && issue.assignees.length > 0) {
        console.log(chalk.magenta(`   Assignees: ${issue.assignees.join(', ')}`));
      }
      console.log();
    });
    
    console.log(chalk.green.bold('✅ All tests passed!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

const csvFile = process.argv[2] || 'example.csv';
testParser(csvFile);
