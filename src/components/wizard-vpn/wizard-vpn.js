import { module } from 'angular';
import TunnelOperator from './tunnel-operators';

export default module('app.components.wizard-vpn', [])
    .component('wizardVpn', {
      controller: class WizardVpnCtrl {
        constructor() {
          'ngInject';

          this.allTunnelOperators = TunnelOperator.allOperators();
          this.tunnelOperator = this.allTunnelOperators[0];
        }

      },
      template: require('./wizard-vpn.html'),
      transclude: true,
    });
