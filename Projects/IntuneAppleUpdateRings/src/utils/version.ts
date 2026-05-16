export function parseVersion(version: string): number[] {
  return version
    .split('.')
    .map(part => Number.parseInt(part, 10))
    .filter(part => !Number.isNaN(part));
}

export function compareVersions(a: string, b: string): number {
  const aParts = parseVersion(a);
  const bParts = parseVersion(b);

  const max = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < max; i++) {
    const aValue = aParts[i] || 0;
    const bValue = bParts[i] || 0;

    if (aValue > bValue) {
      return 1;
    }

    if (aValue < bValue) {
      return -1;
    }
  }

  return 0;
}

export function calculateVersionLag(installed: string, latest: string) {
  const installedParts = parseVersion(installed);
  const latestParts = parseVersion(latest);

  return {
    majorLag: Math.max(0, (latestParts[0] || 0) - (installedParts[0] || 0)),
    minorLag: Math.max(0, (latestParts[1] || 0) - (installedParts[1] || 0)),
    patchLag: Math.max(0, (latestParts[2] || 0) - (installedParts[2] || 0))
  };
}
