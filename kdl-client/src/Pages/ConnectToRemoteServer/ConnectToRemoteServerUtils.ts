import { CHECK } from 'kwc';

export function validateServerUrl(value: string, usedUrls: string[]) {
  return CHECK.getValidationError([
    CHECK.isFieldNotEmpty(value),
    CHECK.isUrlValid(value),
    CHECK.isItemDuplicated(value, usedUrls, 'server URL'),
  ]);
}
