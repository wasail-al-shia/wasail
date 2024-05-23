import React from "react";
//import NotoNaskhArabic from "../NotoNaskhArabic.ttf";
const NotoNaskhArabic = require("@fontsource-variable/noto-naskh-arabic");
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { bookName, sectionName, chapterName } from "../utils/app";

console.log("NNa", NotoNaskhArabic);
Font.register({
  family: "NotoNaskhArabic",
  src: NotoNaskhArabic,
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
  },
});

// Create Document Component
export default ({ chapter }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{bookName(chapter.section.book)}</Text>
        <Text>{sectionName(chapter.section)}</Text>
        <Text>{chapterName(chapter)}</Text>
      </View>
      {chapter.reports.map((report) => (
        <View key={report.id} style={styles.section}>
          <Text>{report.headingEng}</Text>
          {report.texts.map((text) => [
            <Text
              key={text.id}
              style={{
                fontFamily: "NotoNaskhArabic",
              }}
            >
              {text.textArb}
            </Text>,
            <Text key={text.id}>{text.textEng}</Text>,
          ])}
        </View>
      ))}
    </Page>
  </Document>
);
