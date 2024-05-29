import PDFDocument from "./pdfkit.js";
import blobStream from "./blob-stream.js";
import { saveAs } from "file-saver";
import { bookName, dwnldSectionName, dwnldChapterName } from "./app.js";
import { flipParenthesis } from "./string.js";
import truncate from "lodash/truncate";
import SVGtoPDF from "svg-to-pdfkit";
import { todayFormatted } from "./date.js";
import { backend } from "../utils/axiosConfig";
import { request } from "../utils/graph-ql";

const FOOTER_TEXT = `(Generated on ${todayFormatted()}. Visit http://wasail-al-shia.net for the most up to date version.)`;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const fontDef = [
  {
    name: "ARB_REG",
    src: "/fonts/MarkaziText-Regular.ttf",
  },
  {
    name: "ENG_REG",
    src: "/fonts/CrimsonText-Regular.ttf",
  },
  {
    name: "ENG_BOLD",
    src: "/fonts/CrimsonText-SemiBold.ttf",
  },
];

const ARB_REG = fontDef[0].name;
const ENG_REG = fontDef[1].name;
const ENG_BOLD = fontDef[2].name;
const COMMENT = fontDef[0].name;

// LETTER: 612 X 792
//const DOC_WIDTH = 792;

const fs = (n) => n * 12;

const registerFonts = async (doc) => {
  var f = await fetch(fontDef[0].src);
  var b = await f.arrayBuffer();
  doc.registerFont(fontDef[0].name, b);

  f = await fetch(fontDef[1].src);
  b = await f.arrayBuffer();
  doc.registerFont(fontDef[1].name, b);

  f = await fetch(fontDef[2].src);
  b = await f.arrayBuffer();
  doc.registerFont(fontDef[2].name, b);
};

const savePdf = (pdfDoc, filename) => {
  const stream = pdfDoc.pipe(new blobStream());
  stream.on("finish", async () => {
    const blob = stream.toBlob("application/pdf");
    saveAs(blob, filename + ".pdf");
  });
};

const refreshIframe = (pdfDoc, setSrcStream) => {
  const stream = pdfDoc.pipe(new blobStream());
  stream.on("finish", async () => {
    setSrcStream(stream.toBlobURL("application/pdf"));
  });
};

const addVerticalSpace = (doc, space = 0.25) => {
  doc.moveDown(space);
  return doc;
};

const addHorizontalRule = (doc, width = 400) => {
  doc.moveDown(0.5);

  doc
    .lineWidth(0.5)
    .moveTo(doc.page.width / 2 - width / 2, doc.y)
    .lineTo(doc.page.width / 2 + width / 2, doc.y)
    .stroke();

  doc.moveDown(0.5);

  return doc;
};

const addHeader = (doc, book, section, chapter, startPage, endPage) => {
  doc.fontSize(fs(0.9));
  for (let i = startPage - 1; i < endPage; i++) {
    doc.switchToPage(i);
    const even = (i + 1) % 2 == 0;
    const odd = !even;

    //Header: Add page number
    let oldTopMargin = doc.page.margins.top;
    doc.page.margins.top = 0; //Dumb: Have to remove top margin in order to write into it

    if (i == startPage - 1) {
      const topMargin = `${bookName(book)}, Section: ${section.sectionNo}`;
      doc.text(
        topMargin,
        70,
        oldTopMargin / 2, // Centered vertically in top margin
        { align: "center", oblique: true }
      );
    } else if (odd && chapter.chapterNo > 0) {
      const topMargin = `${bookName(book)}, Section: ${
        section.sectionNo
      }, Chapter: ${chapter.chapterNo}`;
      doc.text(
        topMargin,
        70,
        oldTopMargin / 2, // Centered vertically in top margin
        { align: "left", oblique: true }
      );
    } else {
      const topMargin = truncate(`${chapter.nameEng}`, {
        length: 70,
      });
      doc.text(
        topMargin,
        70,
        oldTopMargin / 2, // Centered vertically in top margin
        { align: "center", oblique: true }
      );
    }
    doc.page.margins.top = oldTopMargin; // ReProtect top margin
  }
};

const addFooter = (doc, startPage, endPage) => {
  doc.fontSize(fs(0.9));
  for (let i = startPage - 1; i < endPage; i++) {
    doc.switchToPage(i);

    //Footer: Add page number
    let oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it
    doc.text(
      "http://wasail-al-shia.net",
      70,
      doc.page.height - oldBottomMargin / 2, // Centered vertically in bottom margin
      { align: "left" }
    );
    doc.text(
      //`Page: ${i + 1} of ${pages.count}`,
      i + 1,
      0,
      doc.page.height - oldBottomMargin / 2, // Centered vertically in bottom margin
      { align: "right" }
    );
    doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
  }
};

const fetchSectionWithReports = (sectionId) =>
  request(`{
    sectionWithReports(sectionId: ${sectionId}) {
      id
      sectionNo
      nameEng
      book {
        id
        nameEng
        code
        volumeNo
      }
      chapters {
        id
        chapterNo
        nameEng
        reports {
          id
          reportNo
          headingEng
          texts {
            id
            textEng
            textArb
          }
          comments {
            id
            commentEng
          }
        }
      }
    }
  }`).then(({ sectionWithReports }) => sectionWithReports);

const fetchChapter = (chapterId) =>
  request(`{
    chapter(chapterId: ${chapterId}) {
      id
      chapterNo
      nameEng
      nameArb
      descEng
      descArb
      section {
        id
        sectionNo
        nameEng
        book {
          id
          nameEng
          code
          volumeNo
        }
      }
      reports {
        id
        reportNo
        headingEng
        texts {
          id
          textEng
          textArb
        }
        comments {
          id
          commentEng
        }
      }
    }
  }`).then(({ chapter }) => chapter);

const addSectionIndex = (doc, section) => {
  var startPage = doc.bufferedPageRange().count;
  doc
    .font(ENG_REG)
    .fontSize(fs(1.1))
    .text(bookName(section.book), { align: "center" });
  addVerticalSpace(doc, 0.1);
  doc
    .font(ENG_REG)
    .fontSize(fs(1.2))
    .text(`Section ${section.sectionNo}: ${section.nameEng}`, {
      align: "center",
    });
  addVerticalSpace(doc, 0.5);
  section.chapters.forEach((chapter) => {
    const hadithStart = Math.min(...chapter.reports.map((r) => r.reportNo));
    const hadithEnd = Math.max(...chapter.reports.map((r) => r.reportNo));
    doc
      .font(ENG_BOLD)
      .fontSize(fs(0.9))
      .text(`Chapter ${chapter.chapterNo}: `, {
        continued: true,
      })
      .font(ENG_REG)
      .text(`(Hadith ${hadithStart} - ${hadithEnd}) ${chapter.nameEng}`);
    addVerticalSpace(doc, 0.15);
  });
  var endPage = doc.bufferedPageRange().count;
  addFooter(doc, startPage, endPage);
  doc.addPage();
};

export const generateSectionPdf = async (sectionId) => {
  //await delay(5000);
  const section = await fetchSectionWithReports(sectionId);
  var doc = new PDFDocument({
    bufferPages: true,
  });
  PDFDocument.prototype.addSVG = function (svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
  };
  await registerFonts(doc);
  addSectionIndex(doc, section);
  section.chapters.forEach((chapter, idx) => {
    var startPage = doc.bufferedPageRange().count;
    addChapter(doc, chapter, chapter.reports);
    var endPage = doc.bufferedPageRange().count;
    addHeader(doc, section.book, section, chapter, startPage, endPage);
    addFooter(doc, startPage, endPage);
    if (idx < section.chapters.length - 1) doc.addPage();
  });
  doc.end();
  savePdf(doc, dwnldSectionName(section.book, section));
  const url = "/rest/record_dwnld_section";
  backend.post(url, { section_id: section.id });
};

export const generateChapterPdf = async (chapterId, setSrcStream) => {
  const chapter = await fetchChapter(chapterId);
  var doc = new PDFDocument({
    bufferPages: true,
  });
  PDFDocument.prototype.addSVG = function (svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
  };
  await registerFonts(doc);

  const startPage = doc.bufferedPageRange().count;
  addChapter(doc, chapter, chapter.reports);
  const endPage = doc.bufferedPageRange().count;

  addHeader(
    doc,
    chapter.section.book,
    chapter.section,
    chapter,
    startPage,
    endPage
  );
  addFooter(doc, startPage, endPage);
  doc.end();

  savePdf(doc, dwnldChapterName(chapter));
  //refreshIframe(doc, setSrcStream);
  const url = "/rest/record_dwnld_chapter";
  backend.post(url, { chapter_id: chapter.id });
};

export const addChapter = (doc, chapter, reports) => {
  const hadithStart = Math.min(...reports.map((r) => r.reportNo));
  const hadithEnd = Math.max(...reports.map((r) => r.reportNo));

  doc.font(ENG_REG);
  if (chapter.chapterNo > 0) {
    doc
      .font(ENG_BOLD)
      .fontSize(fs(1.2))
      .text(`CHAPTER ${chapter.chapterNo}`, { align: "center" });
    addVerticalSpace(doc, 0.5);
  }
  doc.font(ENG_REG);
  doc.fontSize(fs(1.2)).text(chapter.nameEng, { align: "center" });
  addVerticalSpace(doc, 0.7);
  if (hadithStart > 0) {
    doc
      .fontSize(fs(1.2))
      .fillColor("#773e16")
      .text(`[ Hadith ${hadithStart} to ${hadithEnd} ]`, { align: "center" })
      .fillColor("#000");
  }
  addVerticalSpace(doc, 4);

  reports.map((report, idx) => {
    if (doc.y > 650) doc.addPage();
    doc
      .font(ENG_REG)
      .fontSize(fs(1))
      .fillColor("#773e16")
      .text(report.headingEng, { align: "center" })
      .fillColor("#000");
    addVerticalSpace(doc);
    report.texts.map((text) => {
      doc
        .font(ARB_REG)
        .fontSize(fs(1.1))
        .text(flipParenthesis(text.textArb).trim(), {
          align: "right",
          features: ["rtla"],
        });
      addVerticalSpace(doc);
      doc
        .font(ENG_REG)
        .fontSize(fs(1))
        .text(text.textEng.trim(), { lineGap: -1, align: "justify" });
      addVerticalSpace(doc);
    });
    report.comments.map((c) => {
      addVerticalSpace(doc);
      doc
        .font(COMMENT)
        .fontSize(fs(1))
        .fillColor("#555")
        .text(c.commentEng.trim(), { lineGap: -1, align: "justify" });
    });
    addHorizontalRule(doc, idx == reports.length - 1 ? 400 : 150);
    addVerticalSpace(doc, 0.5);
  });
  doc.fontSize(fs(0.9));
  doc.fillColor("#000");
  doc.text(FOOTER_TEXT, { align: "center" });
  return doc;
};

export const generateEasyGuidePdf = async (easyGuide, setSrcStream) => {
  var doc = new PDFDocument({
    bufferPages: true,
  });
  await registerFonts(doc);
  doc.font(ENG_BOLD).fontSize(fs(1.1)).text("EASY GUIDE");
  addVerticalSpace(doc, 0.1);
  doc.font(ENG_REG).fontSize(fs(1.2)).text(easyGuide.title);
  addVerticalSpace(doc, 0.1);

  easyGuide.easyGuideFragments.map((egFragment, idx) => {
    if (egFragment.report) {
      egFragment.report.texts.map((text) => {
        doc
          .font(ENG_REG)
          .fontSize(fs(1))
          .text(text.textEng.trim(), { lineGap: -1, align: "justify" });
        addVerticalSpace(doc);
      });
      egFragment.report.comments.map((c) => {
        addVerticalSpace(doc);
        doc
          .font(ENG_REG)
          .fontSize(fs(0.8))
          .fillColor("#444")
          .text(c.commentEng.trim(), { lineGap: -1, align: "justify" });
      });
    } else {
      doc.font(ENG_REG).fontSize(fs(1)).text(egFragment.html);
    }
  });

  doc.end();

  savePdf(doc, "eg");
  //refreshIframe(doc, setSrcStream);
  // const url = "/rest/record_dwnld_easyguide";
  // backend.post(url, { easy_guide_id: easyGuide.id });
};

// const addSvgDivider = (doc, svg) => {
//   doc.moveDown(0.5);
//   doc.addSVG(svg, DOC_WIDTH / 2 - 200 + 10, doc.y, {
//     width: 200,
//     height: 10,
//     assumePt: true,
//   });
//   doc.moveDown(0.5);
//   return doc;
// };

// const getCurrentPageNumber = (doc) => {
//   const pages = doc.bufferedPageRange();
//   const currentPage = doc.page;
//   let currentPageNumber = null;
//   pages.forEach((page, i) => {
//     if (page === currentPage) {
//       currentPageNumber = i;
//     }
//   });
//   if (currentPageNumber === null) {
//     throw new Error("Unable to get current page number");
//   }
//   return currentPageNumber;
// };

// const addHorizontalRule2 = (
//   doc,
//   spaceFromEdge = 0,
//   linesAboveAndBelow = 0.5
// ) => {
//   doc.moveDown(linesAboveAndBelow);

//   doc
//     .lineWidth(0.5)
//     .moveTo(0 + spaceFromEdge, doc.y)
//     .lineTo(doc.page.width - spaceFromEdge, doc.y)
//     .stroke();

//   doc.moveDown(linesAboveAndBelow);

//   return doc;
// };
