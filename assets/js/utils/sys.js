// https://github.com/react-hook-form/react-hook-form/discussions/2549
export const blockFormSubmitOnEnterKey = (e) => {
  if (e.code === "Enter") e.preventDefault();
};
