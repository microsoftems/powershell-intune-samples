export function buildMarkdownReport(devices: any[]): string {
  const lines: string[] = [];

  lines.push('# Intune Apple Update Rings Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Device | OS | Version | User |');
  lines.push('| --- | --- | --- | --- |');

  for (const device of devices) {
    lines.push(
      `| ${device.deviceName} | ${device.operatingSystem} | ${device.osVersion} | ${device.userPrincipalName || ''} |`
    );
  }

  return lines.join('\n');
}
