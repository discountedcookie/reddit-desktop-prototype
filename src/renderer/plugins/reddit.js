import Snoowrap from 'snoowrap';

export default {
  async install(app) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    let wrapper;

    if (refreshToken) {
      wrapper = new Snoowrap({
        userAgent: 'reddit client (dev)',
        clientId: window.env.REDDIT_CLIENT_ID,
        clientSecret: window.env.REDDIT_CLIENT_SECRET,
        accessToken,
        refreshToken,
      });
    } else {
      wrapper = await Snoowrap.fromApplicationOnlyAuth({
        userAgent: 'reddit-client (dev)',
        clientId: window.env.REDDIT_CLIENT_ID,
        clientSecret: window.env.REDDIT_CLIENT_SECRET,
        grantType: 'client_credentials',
      });
    }

    wrapper.config({
      proxies: false,
      debug: true,
    });

    app.provide('reddit', wrapper);
    if (this.markAsReady) this.markAsReady();
    else this.markAsReady = true;
  },
  isReady() {
    return new Promise((resolve) => {
      if (this.markAsReady) resolve();
      this.markAsReady = resolve;
    });
  },
  markAsReady: null,
};
