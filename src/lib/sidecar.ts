import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ReportSidecarSchema, type ReportSidecar } from './reportSchema';

/**
 * Loads and validates the JSON sidecar for a given report date.
 * Returns null if the file does not exist or fails schema validation.
 */
export function loadSidecar(iso: string): ReportSidecar | null {
  const filePath = join(process.cwd(), 'Reports', `${iso}_AI_Weekly.json`);
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const result = ReportSidecarSchema.safeParse(JSON.parse(raw));
    if (!result.success) {
      console.warn(`[sidecar] Schema validation failed for ${iso}:`, result.error.issues);
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}
