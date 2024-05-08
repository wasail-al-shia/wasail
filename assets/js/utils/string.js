import capitalize from "lodash/capitalize";

const swapBracket = (br) => {
  switch (br) {
    case "(":
      return ")";
    case ")":
      return "(";
  }
};

export const flipParenthesis = (str) => str.replace(/[()[\]{}]/g, swapBracket);

export const extractFirstNumber = (text) => {
  const regex = /[-+]?(\d*\.?\d+)/; // Regular expression to match numbers
  const match = text.match(regex);
  console.log("match=", match);

  //extract the first matched group
  return match ? parseFloat(match[1]) : null;
};

export const capitalizeFirstLetter = (str) =>
  str
    .split(" ")
    .map((x) => capitalize(x))
    .join(" ");
