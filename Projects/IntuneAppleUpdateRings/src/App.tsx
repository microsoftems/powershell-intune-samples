import { useState } from 'react';
import { msalInstance, graphScopes } from './auth/msal';
import { getAppleManagedDevices } from './collectors/appleDevices';
import { recommendRing } from './rules/ringRecommendations';
import { evaluateAppleDeviceVersion } from './rules/releaseIntelligence';
import { ReleaseHealthBadge } from './components/ReleaseHealthBadge';

export default function App() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    await msalInstance.loginPopup({
      scopes: graphScopes
    });
  }

  async function loadDevices() {
    setLoading(true);

    try {
      const data = await getAppleManagedDevices();
      setDevices(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Intune Apple Update Rings</h1>

      <p>
        Browser-only Apple update tracking and release control for Microsoft Intune.
      </p>

      <button onClick={signIn}>Sign in with Microsoft 365</button>
      <button onClick={loadDevices} disabled={loading}>
        {loading ? 'Loading...' : 'Load Apple Devices'}
      </button>

      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>OS</th>
            <th>Installed</th>
            <th>Latest</th>
            <th>Health</th>
            <th>User</th>
            <th>Recommended Ring</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => {
            const recommendation = recommendRing(device);
            const release = evaluateAppleDeviceVersion(device);

            return (
              <tr key={device.id}>
                <td>{device.deviceName}</td>
                <td>{device.operatingSystem}</td>
                <td>{device.osVersion}</td>
                <td>{release.latestVersion || 'Unknown'}</td>
                <td>
                  <ReleaseHealthBadge risk={release.risk} />
                </td>
                <td>{device.userPrincipalName}</td>
                <td>{recommendation.ring}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
