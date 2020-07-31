import { BrowserWindow } from 'electron';
import Snoowrap from 'snoowrap';
import fetch from 'node-fetch';

export default async (mainWindow, ipcMain) => {
  function base64(data) {
    const buffer = Buffer.from(data);
    return buffer.toString('base64');
  }

  function handleRedirect(window, callback) {
    return (event, url) => {
      if (url.startsWith(process.env.REDDIT_REDIRECT_URI)) {
        event.preventDefault();
        window.close();
      }

      const code = (new URLSearchParams(url.split('?')[1])).get('code');
      const accessTokenURL = 'https://www.reddit.com/api/v1/access_token';
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', process.env.REDDIT_REDIRECT_URI);

      fetch(accessTokenURL, {
        method: 'post',
        body: params,
        headers: {
          Authorization: `Basic ${base64(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`)}`,
          'User-Agent': 'Viewer for reddit (dev)',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          const {
            access_token: accessToken,
            refresh_token: refreshToken,
          } = json;

          callback({
            accessToken,
            refreshToken,
          });
        })
        .catch((err) => console.error(err));
    };
  }

  ipcMain.handle('login', () => {
    const window = new BrowserWindow({
      modal: true,
      parent: mainWindow,
    });

    const authUrl = Snoowrap.getAuthUrl({
      clientId: process.env.REDDIT_CLIENT_ID,
      scope: [
        'history',
        'identity',
        'identity',
        'mysubreddits',
        'read',
        'save',
        'vote',
      ],
      state: 'fe211bebc52eb3da9bef8db6e63104d3',
      redirectUri: process.env.REDDIT_REDIRECT_URI,
    });

    window.loadURL(authUrl);

    return new Promise((resolve) => {
      window.webContents.on('will-redirect', handleRedirect(window, resolve));
    });
  });
};
