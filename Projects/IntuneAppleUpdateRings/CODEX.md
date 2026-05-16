# Codex Handoff: Intune Apple Update Rings

## Mission

Continue building `Projects/IntuneAppleUpdateRings` as a browser-only Microsoft Intune Apple update governance tool.

The app must remain:

- Browser-only
- No backend
- No client secret
- No application permissions
- Microsoft 365 sign-in using MSAL.js
- Microsoft Graph delegated access only
- Tenant data processed locally in the browser

## Current state

The project currently includes:

- React + Vite + TypeScript scaffold
- MSAL browser authentication
- Microsoft Graph client helper
- Apple managed device collector
- release intelligence model
- seed Apple release catalog
- enterprise release catalog JSON format
- ring recommendation logic
- release-health badge
- Markdown export helper

## Important files

```text
package.json
.env.example
public/release-catalog.example.json
src/App.tsx
src/auth/msal.ts
src/graph/client.ts
src/collectors/appleDevices.ts
src/data/appleReleases.ts
src/models/appleRelease.ts
src/models/releaseCatalog.ts
src/rules/releaseIntelligence.ts
src/rules/releaseApproval.ts
src/rules/ringRecommendations.ts
src/services/releaseCatalogService.ts
src/export/markdownReport.ts
src/utils/version.ts
src/utils/download.ts
src/components/ReleaseHealthBadge.tsx
```

## Next build objective

Move from device inventory + release-health display to **real Intune Apple policy intelligence**.

The next milestone should show:

```text
Approved release state
vs
Configured Intune policy state
vs
Actual device state
```

## Tasks

### 1. Add Intune Apple policy collectors

Create collectors for:

- `/beta/deviceManagement/configurationPolicies`
- `/beta/deviceManagement/deviceConfigurations`
- settings catalog policies likely related to Apple software updates
- legacy iOS update configurations where available

Suggested files:

```text
src/collectors/configurationPolicies.ts
src/collectors/appleUpdatePolicies.ts
src/models/intunePolicy.ts
```

Return normalized policy objects instead of leaking raw Graph shape through the UI.

### 2. Add assignment model

Create a model for policy assignments:

```ts
interface IntunePolicyAssignment {
  policyId: string;
  policyName: string;
  targetType: 'group' | 'allDevices' | 'allUsers' | 'unknown';
  targetId?: string;
  targetName?: string;
  intent?: 'include' | 'exclude';
}
```

Initial implementation may capture IDs only. Friendly group names can be added later.

### 3. Detect Apple update policy conflicts

Create rules to detect:

- more than one Apple update policy assigned to the same target
- devices with no matching update policy
- policies with no assignments
- policies targeting broad groups without an explicit ring name
- legacy MDM update policy usage where DDM should be preferred
- exception rings without an expiry date in notes/description

Suggested file:

```text
src/rules/policyConflicts.ts
```

### 4. Add policy dashboard section

Extend `App.tsx` or split into components:

```text
src/components/ReleaseCatalogTable.tsx
src/components/DeviceReleaseTable.tsx
src/components/PolicyFindingsTable.tsx
```

Show:

- policy name
- platform
- source type: DDM/settings catalog/legacy/unknown
- assignment count
- inferred ring
- risk/finding count

### 5. Improve report export

Update Markdown report to include:

- tenant summary placeholder
- release catalog summary
- Apple fleet summary
- update policy summary
- findings table
- recommended actions

Keep export browser-only.

### 6. Add CSV export

Create:

```text
src/export/csvReport.ts
```

Export at least:

- device name
- platform
- installed version
- latest version
- approved version
- health
- recommended ring

### 7. Add basic app styling

Add minimal readable CSS:

```text
src/styles.css
```

Keep it clean and professional. Avoid external UI framework for now unless there is a strong reason.

## Graph permission constraints

Read-only mode should use delegated permissions:

```text
User.Read
DeviceManagementManagedDevices.Read.All
DeviceManagementConfiguration.Read.All
Group.Read.All
Directory.Read.All
```

Do not add write permissions until a separate write-mode milestone.

Future write mode may require:

```text
DeviceManagementConfiguration.ReadWrite.All
Group.ReadWrite.All
```

## Security constraints

Do not introduce:

- backend APIs
- client secrets
- app-only Graph permissions
- persistent tenant data storage
- telemetry uploads
- third-party analytics

Use browser session storage for MSAL cache as currently configured.

## Acceptance criteria for next PR

The next PR should:

1. Build successfully with `npm run build`.
2. Keep the app browser-only.
3. Show Apple device release health.
4. Show loaded enterprise release catalog.
5. Show discovered Intune Apple update/configuration policies.
6. Display at least basic policy findings.
7. Export Markdown and CSV reports.
8. Include clear comments where Graph beta API shape may need adjustment.

## Product direction

Longer term, this app should become a browser-first Intune governance tool for Apple release control:

```text
Apple release discovery
→ enterprise approval catalog
→ Intune policy audit
→ ring conflict detection
→ rollout planning
→ controlled Graph write mode
→ customer-ready reports
```

It should eventually integrate with the separate website markdown/diff tracker so Apple release pages can feed the enterprise release catalog automatically.
