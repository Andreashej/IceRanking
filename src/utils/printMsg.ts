export const printMsg: (messages: (string | typeof Error)[]) => void = (messages) => {
  // eslint-disable-next-line no-console
  console.log(...messages);
};
