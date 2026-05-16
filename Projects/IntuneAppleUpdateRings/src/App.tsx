import { useEffect, useState } from 'react';
import { msalInstance, graphScopes } from './auth/msal';
import { getAppleManagedDevices } from './collectors/appleDevices';
import { recommendRing } from './rules/ringRecommendations';
import { evaluateAppleDeviceVersion } from './rules/releaseIntelligence';
import { ReleaseHealthBadge } from './components/ReleaseHealthBadge';
import { loadReleaseCatalog } from './services/releaseCatalogService';
import { ReleaseCatalogDocument } from './models/releaseCatalog';
import { buildMarkdownReport } from './export/markdownReport';
import { downloadTextFile } from './utils/download';

export default function App() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<ReleaseCatalogDocument | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const releaseCatalog = await loadReleaseCatalog();
        setCatalog(releaseCatalog);
      } catch (error) {
        console.error('Failed to load release catalog', error);
      }
    }

    loadCatalog();
  }, []);

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

  function exportMarkdown() {
    const markdown = buildMarkdownReport(devices);

    downloadTextFile(
      `intune-apple-update-report-${new Date().toISOString()}.md`,
      markdown,
      'text/markdown'
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Intune Apple Update Rings</h1>

      <p>
        Browser-only Apple update tracking and release control for Microsoft Intune.
      </p>

      <div style={{ marginBottom: 16 }}>
        <button onClick={signIn}>Sign in with Microsoft 365</button>
        <button onClick={loadDevices} disabled={loading}>
          {loading ? 'Loading...' : 'Load Apple Devices'}
        </button>
        <button onClick={exportMarkdown} disabled={devices.length === 0}>
          Export Markdown Report
        </button>
      </div>

      {catalog && (
        <div style={{ marginBottom: 24 }}>
          <h2>Enterprise Release Catalog</h2>

          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Latest</th>
                <th>Approved</th>
                <th>Minimum</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {catalog.releases.map(release => (
                <tr key={release.platform}>
                  <td>{release.platform}</td>
                  <td>{release.latestVersion}</td>
                  <td>{release.approvedVersion || 'Not set'}</td>
                  <td>{release.minimumSupportedVersion}</td>
                  <td>{release.approvalState || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
