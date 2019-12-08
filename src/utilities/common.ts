export function getNextKey(data: any, prefix: string) {
  if (typeof data !== 'object') {
    return null;
  }

  const index =
    Object.keys(data).reduce((acc, key) => {
      const keyIndex = Number(key.replace(prefix, ''));
      if (keyIndex > acc) {
        return keyIndex;
      }

      return acc;
    }, 0) + 1;

  return prefix + index;
}
