export const bookName = (book) =>
  book.volumeNo == 0 ? book.nameEng : `${book.nameEng} Vol. ${book.volumeNo}`;

export const chapterCrumb = (sectionNo, chapterNo) =>
  `Section ${sectionNo}, Chapter ${chapterNo}`;

export const generateReference = (report) => {
  const chapter = report.chapter;
  const section = chapter.section;
  const book = section.book;
  return `${bookName(book)}, Section ${section.sectionNo}, Chapter ${
    chapter.chapterNo
  }, ${report.headingEng}`;
};

export const reportHyperLink = (report) => {
  const p = window.location.protocol;
  const h = window.location.hostname;
  return report.chapter.section.book.code == "WAS"
    ? `${p}//${h}/w/${report.reportNo}`
    : `${p}//${h}/r/${report.id}`;
};

export const generatePlainText = (report) => {
  const chapter = report.chapter;
  const section = chapter.section;
  const book = section.book;
  const texts = report.texts
    ?.map((text) => [text.textArb, text.textEng])
    .flat(Infinity);

  return [
    report.headingEng,
    ...texts,
    generateReference({ book, section, chapter, report }),
    reportHyperLink(report),
  ].join("\n");
};

export const navBookLink = (bookId) => `/b/${bookId}`;
export const navChapterLink = (chapterId) => `/c/${chapterId}`;
export const navReportLink = (reportId) => `/r/${reportId}`;
export const navSearchReultsLink = (queryStr) => `/q/${queryStr}`;
