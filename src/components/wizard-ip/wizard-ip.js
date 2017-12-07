import { copy, module } from 'angular';
import IpConfig from '../../model/ip-config';

export default module('app.components.wizard-ip', [])
  .component('wizardIp', {
    bindings: {
      wirelessDevices: '<',
      ip: '<',
      onUpdate: '&',
    },
    controller: class WizardIpCtrl {
      constructor($scope) {
        'ngInject';

        this.newIp = {};

        // eslint-disable-next-line no-restricted-properties
        this.pow = Math.pow;

        $scope.$watch('$ctrl.ip', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.newIp', this.updateOutput.bind(this), true);
      }

      updateFromInput(ip) {
        copy(ip, this.newIp);
      }

      updateOutput(newIp) {
        const ip = new IpConfig({
          v4Prefix: newIp.v4Prefix,
          v6Prefix: newIp.v6Prefix,
        });
        console.log('Sending', {ip});
        this.onUpdate({ip});
      }
    },
    template: require('./wizard-ip.html'),
  });
