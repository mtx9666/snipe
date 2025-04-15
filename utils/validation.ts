import { PublicKey } from '@solana/web3.js';

export const validateTokenAddress = (address: string): { valid: boolean; error?: string } => {
  try {
    if (!address) {
      return { valid: false, error: 'Token address is required' };
    }
    
    // Validate Solana public key format
    new PublicKey(address);
    
    // Check address length
    if (address.length !== 44 && address.length !== 43) {
      return { valid: false, error: 'Invalid token address length' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid token address format' };
  }
};

export const validateSolAmount = (amount: string): { valid: boolean; error?: string } => {
  try {
    if (!amount) {
      return { valid: false, error: 'Amount is required' };
    }
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      return { valid: false, error: 'Amount must be a number' };
    }
    
    if (numAmount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }
    
    if (numAmount > 100000) { // Reasonable upper limit for SOL amount
      return { valid: false, error: 'Amount exceeds maximum limit' };
    }
    
    // Check decimal places (SOL has 9 decimals)
    const decimalPlaces = amount.includes('.') ? amount.split('.')[1].length : 0;
    if (decimalPlaces > 9) {
      return { valid: false, error: 'Too many decimal places' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid amount format' };
  }
};

export const validateSlippage = (slippage: string): { valid: boolean; error?: string } => {
  try {
    if (!slippage) {
      return { valid: false, error: 'Slippage is required' };
    }
    
    const numSlippage = parseFloat(slippage);
    
    if (isNaN(numSlippage)) {
      return { valid: false, error: 'Slippage must be a number' };
    }
    
    if (numSlippage < 0.1) {
      return { valid: false, error: 'Slippage must be at least 0.1%' };
    }
    
    if (numSlippage > 50) {
      return { valid: false, error: 'Slippage cannot exceed 50%' };
    }
    
    // Check decimal places
    const decimalPlaces = slippage.includes('.') ? slippage.split('.')[1].length : 0;
    if (decimalPlaces > 1) {
      return { valid: false, error: 'Too many decimal places' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid slippage format' };
  }
};

export const sanitizeInput = (input: string): string => {
  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove any script tags and their contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove special characters except those needed for addresses and numbers
  sanitized = sanitized.replace(/[^\w\s.-]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
};

// Rate limiting utility
const rateLimits = new Map<string, { count: number; timestamp: number }>();

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimits.get(key);
  
  if (!record) {
    rateLimits.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (now - record.timestamp > windowMs) {
    rateLimits.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count += 1;
  rateLimits.set(key, record);
  return true;
}; 