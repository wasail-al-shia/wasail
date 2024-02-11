export const bookName = (book) =>
  book.volumeNo == 0 ? book.nameEng : `${book.nameEng} Vol. ${book.volumeNo}`;

export const chapterCrumb = (sectionNo, chapterNo) =>
  `Section ${sectionNo}, Chapter ${chapterNo}`;

export const generateReference = ({ book, section, chapter, report }) =>
  `${bookName(book)}, Section ${section.sectionNo}, Chapter ${
    chapter.chapterNo
  }, ${report.headingEng}`;

export const reportHyperLink = (reportId) => {
  const p = window.location.protocol;
  const h = window.location.hostname;
  const port = window.location.port;
  return `${p}://${h}:${port}/r/${reportId}`;
};

export const generatePlainText = ({ book, section, chapter, report }) => {
  const texts = report.texts
    ?.map((text) => [text.textArb, text.textEng])
    .flat(Infinity);
  return [
    report.headingEng,
    ...texts,
    generateReference({ book, section, chapter, report }),
    reportHyperLink(report.id),
  ].join("\n");
};

export const navBookLink = (bookId) => `/b/${bookId}`;
export const navChapterLink = (chapterId) => `/c/${chapterId}`;
export const navReportLink = (reportId) => `/r/${reportId}`;
export const navSearchReultsLink = (queryStr) => `/q/${queryStr}`;
