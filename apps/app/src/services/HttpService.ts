import Router from 'next/router';
import CurrentUserProvider from './CurrentUserProvider';
import { showPrompt } from '../notifications/PageNotificationService';
import { parseHash, parseHashParam } from '../hooks/useHashParam';
import { isAbsoluteUrl, trimStartChar } from '../helpers/StringHelpers';
import { signalcoApiEndpoint } from './AppSettingsProvider';

export default class HttpService {
  public static tokenFactory?: () => Promise<string>;
  public static get isOnline(): boolean {
    if (typeof window !== 'undefined' && 'onLine' in navigator)
      return navigator.onLine;
    return true;
  }

  private static async _getBearerTokenAsync() {
    let token: string | undefined;

    // Try to use cached token (for offline access)
    const cachedToken = CurrentUserProvider.getToken();
    if (cachedToken != null) {
      token = cachedToken;
      console.debug('Using cached token.');
    }

    // If unable to use cached token, ask factory for one
    if (token == null &&
      typeof HttpService.tokenFactory !== 'undefined') {
      token = await HttpService.tokenFactory();
      CurrentUserProvider.setToken(token);
      console.debug('Used token factory. Have token?', typeof token !== 'undefined')
    }

    // Cache token and return if available
    if (typeof token !== 'undefined') {
      return `Bearer ${token}`;
    }

    console.warn('Token is undefined');
    throw new Error('Login failed.');
  };

  public static async getAsync<T>(url: string, data?: any): Promise<T> {
    return await this.requestAsync(url, 'get', data) as T;
  }

  public static async requestAsync(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    headers?: Record<string, string>
  ) {
    const token = await HttpService._getBearerTokenAsync();
    try {
        var urlResolved = new URL(isAbsoluteUrl(url) ? url : HttpService.getApiUrl(url));
        if (method === 'get' && data) {
            urlResolved.search = new URLSearchParams(data).toString();
        }
        const response = await fetch(urlResolved, {
            method: method,
            body: method !== 'get' ? JSON.stringify(data) : undefined,
            headers: {
                Accept: 'application/json',
                Authorization: token,
                'Content-Type': 'application/json',
                ...headers
            },
        });

        if (response.status === 200) {
            try {
                return await response.json();
            } catch {
                return null;
            }
        }

        if (response.status === 403) {
            console.warn('Token expired: ', response.statusText, response.status);
            CurrentUserProvider.setToken(undefined);

            // Check if we are already reloading to authenticate
            const isAuthReload = parseHashParam('authReload');
            if (isAuthReload === 'true') {
                // Show notification to manually reload the app
                showPrompt(
                    'Authorization failed. Please reload the app to continue...',
                    'error',
                    'Reload',
                    () => {
                        window.location.replace('/');
                    });
                return;
            }

            // Reload with auth reload flag
            const hash = parseHash();
            hash.set('authReload', 'true');
            Router.push({ hash: hash.toString() }, undefined, {shallow: false});
        }

        let bodyText: string | null = null;
        try {
            bodyText = await response.text()
        } catch {
            bodyText = 'empty response';
        }
        throw new Error(`Got status ${response.statusText} (${response.status}): bodyText`);
    } catch(err) {
        console.error('Unknown API error', err);
        throw err;
    }
  }

  public static getApiUrl(url: string): string {
    return signalcoApiEndpoint() + trimStartChar(url, '/');
  }
}
