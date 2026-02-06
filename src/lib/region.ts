import { DEFAULT_REGION_CODE, REGION_PRICING_MAP } from "./pricing";

const STORAGE_KEY = "sb_region";

/**
 * Detect user's region/country
 * Priority order:
 * 1. Saved preference in localStorage (from explicit user selection)
 * 2. Server-side IP detection (Vercel/Cloudflare headers)
 * 3. Accept-Language header
 * 4. Return empty string for unknown regions (triggers 20% markup)
 *
 * NOTE: We do NOT default to "IN" anymore. Unknown regions should be treated
 * as international users with 20% markup applied for safety.
 */
export async function detectUserRegion(): Promise<string> {
  // Check for saved preference first
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      console.log("[REGION] Using saved region preference:", saved);
      return saved;
    }
  } catch {
    // localStorage might not be available
  }

  // Try to get from server-side IP detection via API
  try {
    const region = await getRegionFromVercelHeader();
    if (region) {
      return region;
    }
  } catch (error) {
    console.log("[REGION] Failed to fetch from server:", error);
  }

  // No detection succeeded - return empty string
  // This will be treated as an unknown region by CurrencyContext
  // Unknown regions get 20% markup applied for safety/international pricing
  console.log("[REGION] Could not detect region, returning unknown (will apply 20% markup)");
  return "";
}

/**
 * Get region from server-side detection
 * This requires a server/edge endpoint to read IP-based headers
 * since they are not accessible from client-side JavaScript
 */
async function getRegionFromVercelHeader(): Promise<string | null> {
  try {
    // Try to fetch from our region detection API
    const response = await fetch("/api/region", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { region?: string | null };
      // Return the region if detected (could be null for unknown)
      if (data.region && typeof data.region === 'string') {
        console.log("[REGION] Server detected region:", data.region);
        return data.region;
      }
      // Server returned null = unknown region
      if (data.region === null) {
        console.log("[REGION] Server could not detect region");
        return null;
      }
    }
  } catch (error) {
    console.log("[REGION] Region API not available:", error instanceof Error ? error.message : String(error));
  }

  return null;
}

/**
 * Save user's region preference
 * Called when user manually switches region/currency picker
 */
export function saveRegionPreference(countryCode: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, countryCode);
  } catch {
    console.log("[REGION] Failed to save region preference");
  }
}

/**
 * Clear saved region preference
 * Falls back to auto-detection
 */
export function clearRegionPreference(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.log("[REGION] Failed to clear region preference");
  }
}

/**
 * Get user's region from localStorage (synchronously)
 * Use detectUserRegion() for async detection with full fallback chain
 */
export function getSavedRegion(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Map currency codes to their primary regions
 * Used when user manually selects a currency to infer their region
 */
export function getCurrencyToRegionMap(): Record<string, string> {
  const map: Record<string, string> = {};

  // Map each region's currency to its country code
  Object.entries(REGION_PRICING_MAP).forEach(([countryCode, pricing]) => {
    // For each currency, map it to the first country that uses it (priority to India for shared currencies)
    if (countryCode === "IN") {
      // Give India priority for shared currencies
      map[pricing.baseCurrency] = countryCode;
    } else if (!map[pricing.baseCurrency]) {
      // For other countries, only set if not already set
      map[pricing.baseCurrency] = countryCode;
    }
  });

  return map;
}

/**
 * Get the most likely region for a given currency code
 * Returns country code if known, otherwise returns undefined
 */
export function getRegionFromCurrency(currencyCode: string): string | undefined {
  const map = getCurrencyToRegionMap();
  return map[currencyCode];
}
