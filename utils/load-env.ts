import * as fs from 'fs';
import * as path from 'path';

export function loadEnvFile(envPath: string) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = envContent.split('\n');
    
    envVars.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
  } catch (error) {
    console.error('Error loading environment file:', error);
  }
}

// Load environment variables
const envPath = path.join(process.cwd(), '.env.production');
loadEnvFile(envPath); 