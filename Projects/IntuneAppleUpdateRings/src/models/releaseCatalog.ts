import { ApplePlatform } from './appleRelease';

export interface ApprovedAppleRelease {
  platform: ApplePlatform;
  latestVersion: string;
  minimumSupportedVersion: string;
  approvedVersion?: string;
  approvalState?: 'pilot' | 'approved' | 'blocked';
  releaseDate?: string;
  approvalDate?: string;
  notes?: string;
}

export interface ReleaseCatalogDocument {
  schemaVersion: number;
  generatedAt: string;
  source: string;
  releases: ApprovedAppleRelease[];
}
