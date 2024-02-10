export const bookName = (book) =>
  book.volumeNo == 0 ? book.nameEng : `${book.nameEng} Vol. ${book.volumeNo}`;

export const lastCrumb = (sectionNo, chapterNo) =>
  `Section ${sectionNo}, Chapter ${chapterNo}`;

export const generateReference = ({ book, section, chapter, report }) =>
  `${bookName(book)}, Section ${section.sectionNo}, Chapter ${
    chapter.chapterNo
  }, ${report.headingEng}`;

export const generatePlainText = ({ book, section, chapter, report }) => {
  const texts = report.texts
    ?.map((text) => [text.textArb, text.textEng])
    .flat(Infinity);
  const link = window.location.href;
  return [
    report.headingEng,
    ...texts,
    generateReference({ book, section, chapter, report }),
    link,
  ].join("\n");
};

export const navBookLink = (bookId) => `/b/${bookId}`;
export const navChapterLink = (chapterId) => `c/${chapterId}`;
export const navSearchReultsLink = (searchStr) => `s/${searchStr}`;
