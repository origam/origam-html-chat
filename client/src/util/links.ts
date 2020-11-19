export function buildReferenceLink(categoryId: string, referenceId: string) {
  return `web+origam-link://objectTag?categoryId=${categoryId}&objectId=${referenceId}`;
}
