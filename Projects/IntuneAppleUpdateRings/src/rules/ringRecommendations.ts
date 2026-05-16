export interface RingRecommendation {
  ring: string;
  reason: string;
}

export function recommendRing(device: any): RingRecommendation {
  const staleDays = Math.floor(
    (Date.now() - new Date(device.lastSyncDateTime).getTime()) / 86400000
  );

  if (staleDays > 30) {
    return {
      ring: 'Exception Ring',
      reason: 'Device has not synced in over 30 days'
    };
  }

  if ((device.userPrincipalName || '').includes('admin')) {
    return {
      ring: 'Ring 0 - IT Pilot',
      reason: 'Administrative or pilot-style account detected'
    };
  }

  return {
    ring: 'Ring 2 - Business Broad',
    reason: 'Default production recommendation'
  };
}
