// @ts-ignore
export const publicPath = __webpack_public_path__
export function assetUrl(url: string): string {
  return `${publicPath}assets/${url}`;
}