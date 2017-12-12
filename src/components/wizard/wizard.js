import { copy, module } from 'angular';
import uiRouter from '@uirouter/angularjs';

require('./wizard.less');

export default module('app.components.wizard', [uiRouter])
  .config(($stateProvider) => {
    'ngInject';

    $stateProvider.state({
      name: 'wizard',
      component: 'wizard',
      resolve: {
        // André: 'ngInject' does not work for some reason,
        //         so let's make it explicit here
        // catch error (we only want to wait for the check to finish)
        online: ['online', online => online.currentProbe.catch(() => false)],
        // catch error (we only want to wait for the check to finish)
        session: ['session', session => session.currentConnect.catch(() => false)],
      },
      url: '/wizard',
    });
  })
  .component('wizard', {
    bindings: {
      config: '<',
    },
    controller: class WizardCtrl {
      constructor($q, $scope, downloadFile, online, router, session) {
        'ngInject';

        this.$q = $q;
        this.downloadFile = downloadFile;
        this.online = online;
        this.router = router;
        this.session = session;
        $scope.$watchCollection('$ctrl.session.authentication', (data) => {
          this.downloadConfig();
        });
      }


      downloadConfig() {
        console.log('Downloading configuration');
        this.router.getNetworkConfig().then((config) => {
          this.networkConfig = config.values;
        }).catch(() => {
          this.networkConfig = {};
        });
        this.router.getFirewallConfig().then((config) => {
          this.firewallConfig = config.values;
        }).catch(() => {
          this.firewallConfig = {};
        });
        this.router.getFreifunkConfig().then((config) => {
          this.config = config;
        }).catch(() => {
          this.config = {};
        });
      }

      download() {
        this.downloadFile.download(
          `config-${this.config.router.name || 'unknown'}.json`,
          JSON.stringify(this.config, undefined, 2),
          'application/json',
          true,
        );
      }

      load(content) {
        this.config = JSON.parse(content);
      }

      submit() {
        if (!this.session.connection) {
          return this.$q.reject(new Error('no connection to router'));
        }
        if (!this.session.authentication) {
          return this.$q.reject(new Error('not authenticated'));
        }

        const newConfig = copy(this.config);
        // due to an ubox bug we have to convert lat and lon to strings
        newConfig.location.lat = newConfig.location.lat && newConfig.location.lat.toString();
        newConfig.location.lng = newConfig.location.lng && newConfig.location.lat.toString();

        this.applied = false;
        this.submitting = true;
        this.error = undefined;
        return this.router.applyUCIConfig({
          config: newConfig,
          firewallConfig: this.firewallConfig,
          networkConfig: this.networkConfig,
        }).then(
          () => {
            this.submitting = false;
            this.applied = true;
          },
          (data) => {
            this.submitting = false;
            this.error = data;
          },
        );
      }
    },
    template: require('./wizard.html'),
  });
