import { AppleRelease } from '../models/appleRelease';

// Seed catalog only.
// Replace later with dynamic ingestion from Apple release feeds.

export const appleReleaseCatalog: AppleRelease[] = [
  {
    platform: 'iOS',
    latestVersion: '26.5',
    minimumSupportedVersion: '25.7',
    source: 'manual',
    notes: 'Replace with dynamically maintained release source.'
  },
  {
    platform: 'iPadOS',
    latestVersion: '26.5',
    minimumSupportedVersion: '25.7',
    source: 'manual'
  },
  {
    platform: 'macOS',
    latestVersion: '26.5',
    minimumSupportedVersion: '25.7',
    source: 'manual'
  }
];
