import { BK_CD_WS } from "../consts";
export const bookName = (book) =>
  book.volumeNo == 0 ? book.nameEng : `${book.nameEng} Vol. ${book.volumeNo}`;

export const chapterCrumb = (sectionNo, chapterNo) =>
  `Section ${sectionNo}, Chapter ${chapterNo}`;

export const generateReference = (report) => {
  console.log("in generateref", report);
  const chapter = report.chapter;
  const section = chapter.section;
  const book = section.book;
  console.log("report.headingENg=", report.headingEng);
  return `${bookName(book)}, Section ${section.sectionNo}, Chapter ${
    chapter.chapterNo
  }, ${report.headingEng}`;
};

const generateReportHyperLink = (report) => {
  const p = window.location.protocol;
  const h = window.location.hostname;
  return report.chapter.section.book.code == BK_CD_WS
    ? `${p}//${h}/${BK_CD_WS}/${report.reportNo}`
    : `${p}//${h}/r/${report.id}`;
};

export const generatePlainText = (report) => {
  const texts = report.texts
    ?.map((text) => [text.textArb, text.textEng])
    .flat(Infinity);

  return [
    report.headingEng,
    ...texts,
    generateReference(report),
    generateReportHyperLink(report),
  ].join("\n");
};

export const navBookLink = (bookId) => `/b/${bookId}`;
export const navChapterLink = (chapterId) => `/c/${chapterId}`;
export const navReportLink = (reportId) => `/r/${reportId}`;
export const navSearchReultsLink = (queryStr) => `/q/${queryStr}`;
