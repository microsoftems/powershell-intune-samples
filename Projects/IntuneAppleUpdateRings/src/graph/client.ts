import { Client } from '@microsoft/microsoft-graph-client';
import { msalInstance, graphScopes } from '../auth/msal';

export async function createGraphClient(): Promise<Client> {
  const accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) {
    throw new Error('No signed in account found');
  }

  const token = await msalInstance.acquireTokenSilent({
    account: accounts[0],
    scopes: graphScopes
  });

  return Client.init({
    authProvider: done => {
      done(null, token.accessToken);
    }
  });
}
