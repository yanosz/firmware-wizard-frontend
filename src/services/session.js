import { module } from 'angular';

export default module('app.services.session', [])
  .service('session', class SessionService {
    // implements authentication as described in
    // https://wiki.openwrt.org/doc/techref/ubus#authentication

    constructor($location, $q, $window, jsonrpc) {
      'ngInject';

      this.$q = $q;
      this.jsonrpc = jsonrpc;
      this.$window = $window;
      this.timeout = 3600; // seconds
      this.initialSessionId = '00000000000000000000000000000000';

      // try to connect to url in local storage or to current url
      //const apiUrl = $window.localStorage.apiUrl || `${$location.protocol()}://${$location.host()}:${$location.port()}/ubus`;
      const apiUrl = 'http://192.168.1.1/ubus';
      console.log(`Connecting to ${apiUrl}`);
      this.currentConnect = this.connect(apiUrl);
    }

    getSessionId() {
      if (!this.authentication) return this.initialSessionId;
      return this.authentication.sessionId;
    }

    probeSystemBoard(apiUrl) {
      return this.jsonrpc.call(apiUrl, this.initialSessionId, 'system', 'board', {});
    }

    connect(apiUrl) {
      if (this.connecting) {
        return this.$q.reject(new Error('already connecting.'));
      }
      this.connecting = true;
      this.isPolicyProblem = false;
      this.currentConnect = this.probeSystemBoard(apiUrl).then(
        (data) => {
          this.connecting = false;
          this.connection = {apiUrl, board: data};
          this.authentication = undefined;
          this.$window.localStorage.apiUrl = apiUrl;
          // try to authenticate with default credentials (for lede factory default)
          return this.$q(resolve => this.authenticate().finally(() => resolve(this.connection)));
        },
        (data) => {
          if (data.status === -1) {
            this.isPolicyProblem = true;
          }
          this.connecting = false;
          this.connection = undefined;
          this.authentication = undefined;
          delete this.$window.localStorage.apiUrl;
          return this.$q.reject(data);
        },
      );
      return this.currentConnect;
    }

    authenticate(username, password) {
      this.emptyPassword = (password == null) || (password === '');
      if (!this.connection) {
        return this.$q.reject(new Error('not connected.'));
      }
      const apiUrl = this.connection.apiUrl;

      if (this.authenticating) {
        return this.$q.reject(new Error('already authenticating.'));
      }
      this.authenticating = true;
      this.authentication = undefined;

      const expires = new Date();

      const args = {
        username: username || 'root',
        password: password || 'brains', // factory lede accepts any password
        timeout: this.timeout,
      };
      return this.jsonrpc.call(apiUrl, this.initialSessionId, 'session', 'login', args)
        .then(
          (data) => {
            this.authenticating = false;
            this.isWrongPassword = false;
            // set expiry date
            expires.setSeconds(expires.getSeconds() + data.expires);

            // set active session
            this.authentication = {
              sessionId: data.ubus_rpc_session,
              username: args.username,
              apiUrl,
              expires,
              timeout: data.timeout,
              data,
            };
            return this.authentication;
          },
          // failed http request
          (data) => {
            this.isWrongPassword = true;
            this.authenticating = false;
            this.error = data;
            return this.$q.reject(data);
          },
        );
    }

    unauthenticate() {
      this.authentication = undefined;
    }
  });
