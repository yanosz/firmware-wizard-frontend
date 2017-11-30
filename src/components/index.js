import { module } from 'angular';

import authenticateModal from './authenticate-modal/authenticate-modal';
import home from './home/home';
import languageDropdown from './language-dropdown/language-dropdown';
import navbar from './navbar/navbar';
import statusOlsr from './status-olsr/status-olsr';
import statusSystem from './status-system/status-system';
import wizard from './wizard/wizard';
import wizardContact from './wizard-contact/wizard-contact';
import wizardIp from './wizard-ip/wizard-ip';
import wizardLocation from './wizard-location/wizard-location';
import wizardMonitoring from './wizard-monitoring/wizard-monitoring';
import wizardRouter from './wizard-router/wizard-router';
import loadFileForm from './load-file-form/load-file-form';
import loadFileButton from './load-file-button/load-file-button';
import luciRef from './luci-ref/luci-ref';
import wizardVpn from './wizard-vpn/wizard-vpn';


export default module('app.components', [
  authenticateModal.name,
  home.name,
  languageDropdown.name,
  navbar.name,
  statusOlsr.name,
  statusSystem.name,
  wizard.name,
  wizardContact.name,
  wizardIp.name,
  wizardLocation.name,
  wizardMonitoring.name,
  wizardRouter.name,
  loadFileButton.name,
  loadFileForm.name,
  luciRef.name,
  wizardVpn.name,
]);
