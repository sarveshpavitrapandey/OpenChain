
import { env } from './env';

/**
 * Loads environment variables from the .env file into the application
 * This is needed because Vite requires environment variables to be prefixed with VITE_
 * We can load the .env variables here and make them available to the application
 */
export const loadEnvVariables = () => {
  // In development, log environment variable availability
  if (env.isDevelopment) {
    console.log('Loading environment variables...');
  }
  
  // You can add any environment variable transformations here if needed
  
  // Return the env object for convenience
  return env;
};
