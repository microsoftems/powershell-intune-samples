export type ApplePlatform = 'iOS' | 'iPadOS' | 'macOS' | 'unknown';

export interface AppleRelease {
  platform: ApplePlatform;
  latestVersion: string;
  minimumSupportedVersion: string;
  releaseDate?: string;
  source: 'manual' | 'apple-security-releases' | 'custom';
  notes?: string;
}

export interface AppleDeviceUpdateState {
  platform: ApplePlatform;
  installedVersion: string;
  latestVersion?: string;
  minimumSupportedVersion?: string;
  majorLag: number;
  minorLag: number;
  patchLag: number;
  isCurrent: boolean;
  isBelowMinimum: boolean;
  isUnknownVersion: boolean;
  risk: 'current' | 'lagging' | 'stale' | 'unsupported' | 'unknown';
}
