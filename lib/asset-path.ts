export function assetPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
