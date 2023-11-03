export const createResponse = (msg: string, data: any, code = 200) => {
  return {
    code,
    data,
    msg,
  };
};
