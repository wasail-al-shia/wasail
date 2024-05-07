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

export const isNumeric = (value) => {
  var searchMask = "is";
  var regEx = new RegExp(searchMask, "ig");
  var replaceMask = "as";

  var result = "This iS IIS".replace(regEx, replaceMask);
  /^\d+$/.test(value);
};

export const capitalizeFirstLetter = (str) =>
  str
    .split(" ")
    .map((x) => capitalize(x))
    .join(" ");
