import { appleReleaseCatalog } from '../data/appleReleases';
import { AppleDeviceUpdateState, ApplePlatform } from '../models/appleRelease';
import { calculateVersionLag, compareVersions } from '../utils/version';

function normalizePlatform(device: any): ApplePlatform {
  const os = (device.operatingSystem || '').toLowerCase();

  if (os.includes('ios')) {
    return 'iOS';
  }

  if (os.includes('ipad')) {
    return 'iPadOS';
  }

  if (os.includes('mac')) {
    return 'macOS';
  }

  return 'unknown';
}

export function evaluateAppleDeviceVersion(device: any): AppleDeviceUpdateState {
  const platform = normalizePlatform(device);

  const release = appleReleaseCatalog.find(r => r.platform === platform);

  if (!release) {
    return {
      platform,
      installedVersion: device.osVersion || 'unknown',
      majorLag: 0,
      minorLag: 0,
      patchLag: 0,
      isCurrent: false,
      isBelowMinimum: false,
      isUnknownVersion: true,
      risk: 'unknown'
    };
  }

  const lag = calculateVersionLag(device.osVersion, release.latestVersion);

  const isCurrent = compareVersions(device.osVersion, release.latestVersion) >= 0;

  const isBelowMinimum =
    compareVersions(device.osVersion, release.minimumSupportedVersion) < 0;

  let risk: AppleDeviceUpdateState['risk'] = 'current';

  if (isBelowMinimum) {
    risk = 'unsupported';
  } else if (lag.majorLag >= 2) {
    risk = 'stale';
  } else if (lag.majorLag >= 1 || lag.minorLag >= 2) {
    risk = 'lagging';
  }

  return {
    platform,
    installedVersion: device.osVersion,
    latestVersion: release.latestVersion,
    minimumSupportedVersion: release.minimumSupportedVersion,
    majorLag: lag.majorLag,
    minorLag: lag.minorLag,
    patchLag: lag.patchLag,
    isCurrent,
    isBelowMinimum,
    isUnknownVersion: false,
    risk
  };
}
