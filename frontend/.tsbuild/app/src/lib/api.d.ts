import { type KyInstance } from 'ky';
/**
 * Configured ky instance for all API calls.
 * Automatically injects the Authorization header and handles 401 responses.
 * Never use raw fetch — always use this instance.
 */
export declare const api: KyInstance;
