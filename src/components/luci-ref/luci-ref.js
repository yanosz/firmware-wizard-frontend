import { module } from 'angular';

export default module('app.components.luci-ref', [])
  .component('luciRef', {
    controller: class LuciRefCtrl {
      constructor($http) {
        'ngInject';
        this.hasLuci = false;
        this.$http = $http;
        this.probe();
      }

      probe() {
        const luciPromise = this.$http.get('/index.html');
        luciPromise.then(
          () => (this.hasLuci = true),
          () => (this.hasLuci = false),
        );

      }
    },
    template: require('./luci-ref.html'),
    transclude: true
  });
