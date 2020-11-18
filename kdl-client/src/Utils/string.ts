const ID_MAX_LENGTH = 15;
const INVALID_ID_CHARS_REGEXP = /[^a-z0-9-]/g;
const SPACES_REGEXP = / +/g;

export function generateSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(SPACES_REGEXP, '-')
    .replace(INVALID_ID_CHARS_REGEXP, '')
    .substr(0, ID_MAX_LENGTH);
}
