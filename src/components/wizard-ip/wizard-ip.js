import { copy, module } from 'angular';

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
        const ip = copy(newIp);
        this.onUpdate({ip});
      }
    },
    template: require('./wizard-ip.html'),
  });
