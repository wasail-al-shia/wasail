import PDFDocument from "../pdfkit.js";
import blobStream from "../blob-stream.js";
import { saveAs } from "file-saver";
import { bookName, sectionName, chapterName, dwnldChapterName } from "./app.js";
import { flipParenthesis } from "./string.js";
import truncate from "lodash/truncate";

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

const addHorizontalRule = (
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

const addVerticalSpace = (doc, space = 0.2) => {
  doc.moveDown(space);
  return doc;
};

const fontDef = [
  {
    name: "ARB_REG",
    src2: "/fonts/IBMPlexSansArabic-Regular.ttf",
    src: "/fonts/Lateef-Regular.ttf",
  },
  {
    name: "ENG_REG",
    src2: "/fonts/Overpass-Regular.ttf",
    src: "/fonts/CrimsonText-Regular.ttf",
  },
];

const ARB_REG = fontDef[0].name;
const ENG_REG = fontDef[1].name;

const registerFonts = async (doc) => {
  var f = await fetch(fontDef[0].src);
  var b = await f.arrayBuffer();
  doc.registerFont(fontDef[0].name, b);

  f = await fetch(fontDef[1].src);
  b = await f.arrayBuffer();
  doc.registerFont(fontDef[1].name, b);
};

export const chapterPdf = async (chapter, reports, setSrcStream) => {
  const section = chapter.section;
  const book = section.book;
  var doc = new PDFDocument({
    bufferPages: true,
  });
  await registerFonts(doc);

  // LETTER: 612 X 792
  doc.font(ENG_REG);
  // doc.fontSize(12).text(bookName(book));
  // doc.fontSize(12).text(sectionName(section));
  if (chapter.chapterNo > 0) {
    doc.fontSize(18).text(`CHAPTER ${chapter.chapterNo}`);
    addVerticalSpace(doc);
  }
  doc.fontSize(18).text(chapter.nameEng);
  addVerticalSpace(doc);
  addVerticalSpace(doc);
  addVerticalSpace(doc);
  addVerticalSpace(doc);

  reports.map((report) => {
    if (doc.y > 650) doc.addPage();
    doc.font(ENG_REG).fontSize(10).text(report.headingEng);
    report.texts.map((text) => {
      doc
        .font(ARB_REG)
        .fontSize(14)
        .text(flipParenthesis(text.textArb), {
          align: "right",
          features: ["rtla"],
        });
      addVerticalSpace(doc);
      doc.font(ENG_REG).fontSize(10).text(text.textEng, { align: "justify" });
      addVerticalSpace(doc);
    });
    addHorizontalRule(doc, 75, 0.5);
  });

  //Global Edits to All Pages (Header/Footer, etc)
  let pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    //Header: Add page number
    let oldTopMargin = doc.page.margins.top;
    doc.page.margins.top = 0; //Dumb: Have to remove top margin in order to write into it
    const topMarginLeft = `${bookName(book)}, Section: ${section.sectionNo}`;
    const topMarginRight = truncate(chapterName(chapter), { length: 70 });
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
      `Page: ${i + 1} of ${pages.count}`,
      0,
      doc.page.height - oldBottomMargin / 2, // Centered vertically in bottom margin
      { align: "right" }
    );
    doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
  }

  doc.end();
  savePdf(doc, dwnldChapterName(chapter));
  //refreshIframe(doc, setSrcStream);

  return doc;
};
