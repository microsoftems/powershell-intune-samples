import { ApprovedAppleRelease } from '../models/releaseCatalog';
import { compareVersions } from '../utils/version';

export function isApprovedForBroadDeployment(
  deviceVersion: string,
  release: ApprovedAppleRelease
): boolean {
  if (!release.approvedVersion) {
    return false;
  }

  return compareVersions(deviceVersion, release.approvedVersion) >= 0;
}

export function requiresExceptionApproval(
  deviceVersion: string,
  release: ApprovedAppleRelease
): boolean {
  if (release.approvalState === 'blocked') {
    return true;
  }

  return compareVersions(deviceVersion, release.minimumSupportedVersion) < 0;
}
