export const extractParameterName = (dynamicRoute: string) => {
  return dynamicRoute.replaceAll('[', '').replaceAll(']', '');
};
