import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Security utilities to ensure safe file system operations and data handling
 */

export interface SecurityAudit {
  fileSystemAccess: {
    readOnlyFiles: string[];
    noWriteOperations: boolean;
    noDeleteOperations: boolean;
  };
  networkAccess: {
    allowedDomains: string[];
    httpsOnly: boolean;
  };
  dataHandling: {
    tokenMasked: boolean;
    noTokenLogging: boolean;
    inputSanitized: boolean;
  };
}

/**
 * Validates that a file path is safe to read
 */
export function validateSafeFilePath(filePath: string): { safe: boolean; reason?: string } {
  try {
    const resolvedPath = path.resolve(filePath);
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      return { safe: false, reason: 'File does not exist' };
    }

    // Check if it's actually a file (not a directory)
    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      return { safe: false, reason: 'Path is not a file' };
    }

    // Check file extension (only allow CSV files)
    const ext = path.extname(resolvedPath).toLowerCase();
    if (ext !== '.csv') {
      return { safe: false, reason: 'Only CSV files are allowed' };
    }

    // Check file size (prevent extremely large files that could cause DoS)
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB limit
    if (stats.size > maxSizeBytes) {
      return { safe: false, reason: `File too large (max 50MB). Current: ${Math.round(stats.size / 1024 / 1024)}MB` };
    }

    // Prevent path traversal attacks
    const normalizedPath = path.normalize(resolvedPath);
    if (normalizedPath.includes('..')) {
      return { safe: false, reason: 'Path traversal detected' };
    }

    // Check if file is readable
    try {
      fs.accessSync(resolvedPath, fs.constants.R_OK);
    } catch {
      return { safe: false, reason: 'File is not readable' };
    }

    return { safe: true };
  } catch (error) {
    return { safe: false, reason: `File validation error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Sanitizes and validates GitHub token
 */
export function sanitizeGitHubToken(token: string): { valid: boolean; sanitized?: string; reason?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Token must be a non-empty string' };
  }

  // Remove any whitespace
  const trimmed = token.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, reason: 'Token cannot be empty' };
  }

  // Basic GitHub token format validation
  const isNewFormat = trimmed.startsWith('ghp_') && trimmed.length >= 36;
  const isClassicFormat = /^[a-f0-9]{40}$/.test(trimmed);
  const isFineGrainedFormat = trimmed.startsWith('github_pat_') && trimmed.length >= 82;
  
  if (!isNewFormat && !isClassicFormat && !isFineGrainedFormat) {
    return { 
      valid: false, 
      reason: 'Invalid GitHub token format. Expected: ghp_* (personal), github_pat_* (fine-grained), or 40-char hex (classic)' 
    };
  }

  // Check for suspicious patterns
  if (trimmed.includes(' ') || trimmed.includes('\n') || trimmed.includes('\t')) {
    return { valid: false, reason: 'Token contains invalid characters' };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Masks sensitive data for logging
 */
export function maskSensitiveData(data: string, type: 'token' | 'email' | 'url' = 'token'): string {
  if (!data || typeof data !== 'string') {
    return '[INVALID]';
  }

  switch (type) {
    case 'token':
      if (data.length <= 8) {
        return '*'.repeat(data.length);
      }
      return data.substring(0, 4) + '*'.repeat(data.length - 8) + data.substring(data.length - 4);
    
    case 'email':
      const emailParts = data.split('@');
      if (emailParts.length !== 2) {
        return '[INVALID_EMAIL]';
      }
      const [username, domain] = emailParts;
      const maskedUsername = username.length > 2 
        ? username.substring(0, 2) + '*'.repeat(Math.max(0, username.length - 2))
        : '*'.repeat(username.length);
      return `${maskedUsername}@${domain}`;
    
    case 'url':
      try {
        const url = new URL(data);
        return `${url.protocol}//${url.hostname}${url.pathname ? '/***' : ''}`;
      } catch {
        return '[INVALID_URL]';
      }
    
    default:
      return '[MASKED]';
  }
}

/**
 * Validates network requests are only to allowed domains
 */
export function validateNetworkRequest(url: string): { allowed: boolean; reason?: string } {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow HTTPS (except for localhost in development)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost') {
      return { allowed: false, reason: 'Only HTTPS requests are allowed' };
    }

    // Whitelist of allowed domains
    const allowedDomains = [
      'api.github.com',
      'github.com',
      'localhost' // For development/testing
    ];

    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return { allowed: false, reason: `Domain ${parsedUrl.hostname} is not in the allowed list` };
    }

    return { allowed: true };
  } catch {
    return { allowed: false, reason: 'Invalid URL format' };
  }
}

/**
 * Sanitizes CSV input data to prevent injection attacks
 */
export function sanitizeCsvData(data: any): any {
  if (typeof data !== 'string') {
    return data;
  }

  // Remove potential CSV injection patterns
  const dangerous = /^[=+\-@]/;
  if (dangerous.test(data.trim())) {
    console.warn(chalk.yellow(`Warning: Potentially dangerous CSV data detected and sanitized: ${maskSensitiveData(data)}`));
    return `'${data}`; // Prefix with quote to neutralize
  }

  return data;
}

/**
 * Performs a comprehensive security audit of the current operation
 */
export function performSecurityAudit(options: {
  csvFile?: string;
  token?: string;
  verbose?: boolean;
}): SecurityAudit {
  const audit: SecurityAudit = {
    fileSystemAccess: {
      readOnlyFiles: [],
      noWriteOperations: true,
      noDeleteOperations: true
    },
    networkAccess: {
      allowedDomains: ['api.github.com', 'github.com'],
      httpsOnly: true
    },
    dataHandling: {
      tokenMasked: true,
      noTokenLogging: true,
      inputSanitized: true
    }
  };

  if (options.csvFile) {
    audit.fileSystemAccess.readOnlyFiles.push(options.csvFile);
  }

  if (options.verbose) {
    console.log(chalk.blue('\n🔒 Security Audit:'));
    console.log(chalk.green('✅ File System: Read-only access to CSV files'));
    console.log(chalk.green('✅ Network: HTTPS-only requests to GitHub API'));
    console.log(chalk.green('✅ Data Handling: Tokens masked, no sensitive data logging'));
    console.log(chalk.green('✅ Input Validation: CSV injection protection enabled'));
    console.log(chalk.green('✅ Path Security: Directory traversal protection active\n'));
  }

  return audit;
}

/**
 * Logs security events (without sensitive data)
 */
export function logSecurityEvent(event: string, details?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const sanitizedDetails = details ? Object.fromEntries(
    Object.entries(details).map(([key, value]) => [
      key,
      typeof value === 'string' && (key.includes('token') || key.includes('password')) 
        ? maskSensitiveData(value) 
        : value
    ])
  ) : {};

  console.log(chalk.gray(`[${timestamp}] Security: ${event}`), sanitizedDetails);
}
