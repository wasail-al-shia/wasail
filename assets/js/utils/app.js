import { BK_CD_WS } from "../consts";
export const bookName = (book) =>
  book.volumeNo == 0 ? book.nameEng : `${book.nameEng} Vol. ${book.volumeNo}`;

export const sectionCrumb = (sectionNo, sectionNm) =>
  sectionNo ? `Section ${sectionNo}` : `${sectionNm}`;

export const chapterCrumb = (chapterNo, chapterNm) =>
  chapterNo ? `Chapter ${chapterNo}` : `${chapterNm}`;

export const sectionName = (section) =>
  section.sectionNo > 0
    ? `Section ${section.sectionNo}: ${section.nameEng}`
    : section.nameEng;

export const chapterName = (chapter) =>
  chapter.chapterNo > 0
    ? `Chapter ${chapter.chapterNo}: ${chapter.nameEng}`
    : chapter.nameEng;

export const generateReference = (report) => {
  const chapter = report.chapter;
  const section = chapter.section;
  const book = section.book;
  return `${bookName(book)}, Section ${section.sectionNo}, Chapter ${
    chapter.chapterNo
  }, ${report.headingEng}`;
};

export const isBookOfHadith = (code) => [BK_CD_WS].includes(code);

const generateReportHyperLink = (report) => {
  const p = window.location.protocol;
  const h = window.location.hostname;
  return report.chapter.section.book.code == BK_CD_WS
    ? `${p}//${h}/h/${report.reportNo}`
    : `${p}//${h}/r/${report.id}`;
};

export const generatePlainText = (report) => {
  const texts = report.texts
    ?.map((text) => [text.textArb, "", text.textEng, ""])
    .flat(Infinity);

  const comment =
    report.comments.length > 0
      ? `Comment: ${report.comments[0].commentEng}`
      : null;

  return [...texts]
    .concat(comment ? [comment, ""] : [])
    .concat([generateReference(report), generateReportHyperLink(report)])
    .join("\n");
};

export const navBookLink = (bookId) => `/b/${bookId}`;
export const navSectionLink = (sectionId) => `/s/${sectionId}`;
export const navChapterLink = (chapterId) => `/c/${chapterId}`;
export const navReportLink = (reportId) => `/r/${reportId}`;
export const navWsReportLink = (reportNo) => `/h/${reportNo}`;
export const navSearchReultsLink = (queryStr) => `/q/${queryStr}`;
