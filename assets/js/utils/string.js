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

export const isNumeric = (value) => /^\d+$/.test(value);

export const capitalizeFirstLetter = (str) =>
  str
    .split(" ")
    .map((x) => capitalize(x))
    .join(" ");
