import { ReleaseCatalogDocument } from '../models/releaseCatalog';

const DEFAULT_CATALOG_PATH = '/release-catalog.example.json';

export async function loadReleaseCatalog(
  path: string = DEFAULT_CATALOG_PATH
): Promise<ReleaseCatalogDocument> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load release catalog from ${path}`);
  }

  return response.json();
}
