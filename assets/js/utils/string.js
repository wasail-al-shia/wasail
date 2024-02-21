function swapBracket(br) {
  switch (br) {
    case "(":
      return ")";
    case ")":
      return "(";
    case "{":
      return "}";
    case "}":
      return "{";
    case "[":
      return "]";
    case "]":
      return "[";
  }
}

export const flipParenthesis = (str) => str.replace(/[()[\]{}]/g, swapBracket);
