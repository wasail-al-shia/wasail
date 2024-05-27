import PDFDocument from "./pdfkit.js";
import blobStream from "./blob-stream.js";
import { saveAs } from "file-saver";
import { bookName, chapterName, dwnldChapterName } from "./app.js";
import { flipParenthesis } from "./string.js";
import truncate from "lodash/truncate";
import SVGtoPDF from "svg-to-pdfkit";
import { todayFormatted } from "./date.js";

const FOOTER_TEXT = `(Generated on ${todayFormatted()}. Visit http://wasail-al-shia.net for the most up to date version.)`;

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

// LETTER: 612 X 792
const DOC_WIDTH = 792;

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

const addHorizontalRule2 = (
  doc,
  spaceFromEdge = 0,
  linesAboveAndBelow = 0.5
) => {
  doc.moveDown(linesAboveAndBelow);

  doc
    .lineWidth(0.5)
    .moveTo(0 + spaceFromEdge, doc.y)
    .lineTo(doc.page.width - spaceFromEdge, doc.y)
    .stroke();

  doc.moveDown(linesAboveAndBelow);

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

const addSvgDivider = (doc, svg) => {
  doc.moveDown(0.5);
  doc.addSVG(svg, DOC_WIDTH / 2 - 200 + 10, doc.y, {
    width: 200,
    height: 10,
    assumePt: true,
  });
  doc.moveDown(0.5);
  return doc;
};

const getCurrentPageNumber = (doc) => {
  const pages = doc.bufferedPageRange();
  const currentPage = doc.page;
  let currentPageNumber = null;
  pages.forEach((page, i) => {
    if (page === currentPage) {
      currentPageNumber = i;
    }
  });
  if (currentPageNumber === null) {
    throw new Error("Unable to get current page number");
  }
  return currentPageNumber;
};

const addHeaderFooter = (doc, pageMap) => {
  const pages = doc.bufferedPageRange();
  doc.fontSize(fs(0.9));
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    //Header: Add page number
    let oldTopMargin = doc.page.margins.top;
    doc.page.margins.top = 0; //Dumb: Have to remove top margin in order to write into it
    const topMarginLeft = `${pageMap[i + 1].bookName}, Section: ${
      pageMap[i + 1].sectionNo
    }`;
    const topMarginRight = truncate(
      `Chapter ${pageMap[i + 1].chapterNo}: ${pageMap[i + 1].chapterName}`,
      { length: 60 }
    );
    doc.text(
      topMarginLeft,
      70,
      oldTopMargin / 2, // Centered vertically in top margin
      { align: i == 0 ? "center" : "left" }
    );
    if (i > 0) {
      doc.text(
        topMarginRight,
        0,
        oldTopMargin / 2, // Centered vertically in top margin
        { align: "right" }
      );
    }
    doc.page.margins.top = oldTopMargin; // ReProtect top margin

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

export const generateSectionPdf = async (section, setSrcStream) => {
  var doc = new PDFDocument({
    bufferPages: true,
  });
  PDFDocument.prototype.addSVG = function (svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
  };
  await registerFonts(doc);
  const pageMap = {};
  section.chapters.forEach((chapter) => {
    addChapter(doc, chapter, chapter.reports, pageMap);
    doc.addPage();
  });
  addHeaderFooter(doc, pageMap);
  doc.end();
  //savePdf(doc, dwnldChapterName(chapter));
  refreshIframe(doc, setSrcStream);
};

export const generateChapterPdf = async (chapter, reports, setSrcStream) => {
  var doc = new PDFDocument({
    bufferPages: true,
  });
  PDFDocument.prototype.addSVG = function (svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
  };
  await registerFonts(doc);

  const pageMap = {};
  await addChapter(doc, chapter, reports, pageMap);
  console.log("pageMap=", pageMap);

  addHeaderFooter(doc, pageMap);
  doc.end();

  savePdf(doc, dwnldChapterName(chapter));
  //refreshIframe(doc, setSrcStream);
};

export const addChapter = async (doc, chapter, reports, pageMap) => {
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
  addVerticalSpace(doc, 2);
  doc
    .fontSize(fs(1.2))
    .fillColor("#773e16")
    .text(`[ Hadith ${hadithStart} to ${hadithEnd}]`, { align: "center" })
    .fillColor("#000");
  addVerticalSpace(doc, 2);
  var svg1 = await fetch("/images/svg2.svg").then((resp) => {
    return resp.text();
  });
  addVerticalSpace(doc, 0.5);

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
        .text(flipParenthesis(text.textArb), {
          align: "right",
          features: ["rtla"],
        });
      addVerticalSpace(doc);
      doc
        .font(ENG_REG)
        .fontSize(fs(1))
        .text(text.textEng, { lineGap: -1, align: "justify" });
    });
    addHorizontalRule(doc, idx == reports.length - 1 ? 400 : 150);
    addVerticalSpace(doc, 0.5);
    //console.log("page =", doc.bufferedPageRange().count);
    pageMap[doc.bufferedPageRange().count] = {
      chapterNo: chapter.chapterNo,
      chapterName: chapter.nameEng,
      sectionNo: chapter.section.sectionNo,
      bookName: bookName(chapter.section.book),
    };
  });
  doc.fontSize(fs(0.9));
  doc.text(FOOTER_TEXT, { align: "center" });
  return pageMap;
};
