# Intune Apple Update Rings

Browser-only Microsoft Intune Apple software update tracking and release-control tool.

This project is intended to run entirely in the browser:

- Microsoft 365 sign-in with MSAL.js
- Delegated Microsoft Graph access
- No backend service
- No client secret
- No tenant data stored outside the browser unless the user exports it

## Product goal

Help Intune admins understand and control Apple update rollout across iOS, iPadOS, and macOS devices.

The first release is read-only audit mode. Later releases can add controlled write mode for creating or updating Intune release rings.

## Why this matters

Microsoft notes that Apple has deprecated MDM-based software update workloads and recommends Declarative Device Management (DDM) for Apple software updates. This tool is designed with that transition in mind.

## MVP scope

Read-only audit:

- Sign in using Microsoft Entra ID
- Read Intune managed Apple devices
- Read Intune configuration policies and legacy device configurations
- Identify current Apple update policy/ring coverage
- Detect devices with no update control
- Detect stale OS versions
- Detect overlapping policy assignments
- Recommend a simple ring model
- Export JSON, CSV, and Markdown findings

## Ring model

| Ring | Purpose | Default behaviour |
| --- | --- | --- |
| Ring 0 - IT Pilot | IT-owned test devices | Earliest rollout |
| Ring 1 - Early Adopters | Friendly users | Short delay |
| Ring 2 - Business Broad | Standard production devices | Controlled broad rollout |
| Ring 3 - Critical / Exec | Sensitive users or critical devices | Longest approved delay |
| Exception Ring | Temporary business/app blockers | Must have owner and expiry |

## Browser-only architecture

```text
Browser SPA
  -> MSAL.js sign-in
  -> Graph delegated token
  -> Intune data collectors
  -> Ring/risk rule engine
  -> Local findings model
  -> Export report
```

## Required Graph permissions

Read-only mode:

```text
User.Read
DeviceManagementManagedDevices.Read.All
DeviceManagementConfiguration.Read.All
Group.Read.All
Directory.Read.All
```

Future write mode:

```text
DeviceManagementConfiguration.ReadWrite.All
Group.ReadWrite.All
```

## Local development

```bash
npm install
npm run dev
```

Create a local `.env` from `.env.example` and supply your Entra app registration details.

## Entra app registration notes

Create a Single-page application redirect URI, for example:

```text
http://localhost:5173
```

Use delegated permissions only. Do not use client secrets in this browser app.

## Initial Graph areas

```http
GET /beta/deviceManagement/managedDevices
GET /beta/deviceManagement/configurationPolicies
GET /beta/deviceManagement/deviceConfigurations
```

Legacy iOS update policy status can also be explored with:

```http
GET /deviceManagement/deviceConfigurations/{id}/microsoft.graph.iosUpdateConfiguration/deviceStatuses
```

## Roadmap

1. Read-only Apple fleet inventory
2. Update ring coverage analysis
3. Stale OS and release-lag tracking
4. Policy assignment conflict detection
5. Markdown/CSV report export
6. DDM policy authoring preview
7. Controlled write mode with Graph change preview
