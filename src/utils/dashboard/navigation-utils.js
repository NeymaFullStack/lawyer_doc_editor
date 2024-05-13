export const onClickFolder = (folder, pathname, router) => {
  folder?.id && router.push(`${pathname}/${folder?.id}`);
};

export function sliceMapUpToaKey(map, key) {
  const slicedMap = new Map();
  for (const [mapKey, value] of map) {
    slicedMap.set(mapKey, value);

    if (mapKey === key) {
      return slicedMap;
    }
  }

  return slicedMap;
}
