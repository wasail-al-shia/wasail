// https://github.com/react-hook-form/react-hook-form/discussions/2549
export const blockFormSubmitOnEnterKey = (e) => {
  if (e.code === "Enter") e.preventDefault();
};

export const randomHue = () => {
  // Choose a random range (0 for range 1, 1 for range 2)
  const rangeChoice = Math.floor(Math.random() * 2);

  if (rangeChoice === 0) {
    // Generate number between 0 and 60
    return Math.floor(Math.random() * 61); // 0 to 60 inclusive
  } else {
    // Generate number between 250 and 360
    return Math.floor(Math.random() * 61) + 0; //150; // 230 to 360 inclusive
  }
};
