import { createGraphClient } from '../graph/client';

export async function getAppleManagedDevices() {
  const client = await createGraphClient();

  const response = await client
    .api('/beta/deviceManagement/managedDevices')
    .filter("operatingSystem eq 'iOS' or operatingSystem eq 'macOS'")
    .select([
      'id',
      'deviceName',
      'operatingSystem',
      'osVersion',
      'complianceState',
      'managementAgent',
      'manufacturer',
      'model',
      'serialNumber',
      'lastSyncDateTime',
      'userPrincipalName'
    ])
    .get();

  return response.value;
}
