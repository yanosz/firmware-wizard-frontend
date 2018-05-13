import { module } from 'angular';

export default module('app.filters.error-list', [])
 .filter('errorList', () => (input) => {
   /* console.log('Errors',input.$error);
   for (const key in input.$error) {
     console.log('Errors-Agg:', key);
    let errors = false;
     if (errors) {
       for (let e in errors) {
         if(e.$name) {
           console.log(`${e.$name} has error ${key}`);
         }
       }
     }
   }*/


//   <li ng-repeat="(key, errors) in wizardForm.$error track by $index"> <strong>{{ key }}</strong> errors
//   <ul>

//   <li ng-repeat="e in errors">{{ e.$name }} has an error: <strong>{{ key }}</strong>.</li>
//   </ul>
//   </li>
//   </ul>
 });
