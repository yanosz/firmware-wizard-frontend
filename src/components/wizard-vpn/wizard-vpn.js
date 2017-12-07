import { copy, module } from 'angular';
import TunnelOperator from '../../model/tunnel-operator';
import VpnConfig from '../../model/vpn-config';

export default module('app.components.wizard-vpn', [])
    .component('wizardVpn', {
      bindings: {
        vpn: '<',
        onUpdate: '&',
      },
      controller: class WizardVpnCtrl {
        constructor($scope) {
          'ngInject';

          this.allTunnelOperators = TunnelOperator.allOperators();
          this.newVpn = new VpnConfig();

          $scope.$watch('$ctrl.vpn', this.updateFromInput.bind(this), true);
          $scope.$watch('$ctrl.newVpn', this.updateOutput.bind(this), true);
        }

        updateFromInput(vpn = {}) {
          this.newVpn = new VpnConfig(vpn.tunnelOperator || this.allTunnelOperators[0]);
        }

          /**
           * Update config in controller according to setings
           * @param newVpn
           */
        updateOutput(newVpn = {}) {
          const vpn = new VpnConfig(newVpn.tunnelOperator);
          console.log('onUpdate', newVpn.tunnelOperator.onUpdate);
          if (newVpn.tunnelOperator.onUpdate) {
            newVpn.tunnelOperator.onUpdate();
          }
          this.onUpdate({vpn});
        }

      },
      template: require('./wizard-vpn.html'),
      transclude: true,
    });
