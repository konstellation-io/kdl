import { registerInstallLocalServerEvent } from './installation';
import { registerCheckRequirementEvent } from './check_requirements';

export function registerLocalServerEvents() {
  registerInstallLocalServerEvent();
  registerCheckRequirementEvent();
}
