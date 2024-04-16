export const onClickFolder = (folder, pathname, router) => {
  folder?.id && router.push(`${pathname}/${folder?.id}`);
};
