import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate an Ethereum address for display
 */
export function truncateAddress(address: string, length: number = 4): string {
  if (address.length <= length * 2 + 4) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}
