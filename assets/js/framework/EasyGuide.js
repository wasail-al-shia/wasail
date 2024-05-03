import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Report from "./Report";
import BreadCrumbs from "../kmui/BreadCrumbs";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import { HEADER_HEIGHT } from "../consts";
import { navEasyGuideCatLink } from "../utils/app";
import Container from "@mui/material/Container";
import { randomHue } from "../utils/sys";

const fetchEasyGuide = ({ queryKey: [, guideId] }) =>
  request(`{
    easyGuide(id: ${guideId}) {
      id
      title
      fragments {
        id
        fragSeqNo
        html
        report {
          id
          chapterId
          reportNo
          headingEng
          review
          hide 
          notes
          texts {
            id
            fragmentNo
            textEng
            textArb
          }
          comments {
            id
            commentSeqNo
            commentEng
            commentArb
          }
        }
      }
      easyGuideCategory {
        id
        name
      }
    }
  }`).then(({ easyGuide }) => easyGuide);

export default () => {
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin, isReviewer } = React.useContext(SessionContext);
  const { easyGuideId } = useParams();
  const { data: easyGuide = {}, isFetching: fetchingEasyGuide } = useQuery(
    ["easyGuide", easyGuidId],
    fetchEasyGuide
  );
  const fragmentFields = [
    {
      name: "fragSeqNo",
      label: "Frag Seq No",
      type: "number",
      size: "small",
      sx: { width: 100 },
      rules: { required: true },
      md: 4,
    },
    {
      name: "reportId",
      label: "Report Id",
      type: "number",
      size: "small",
      sx: { width: 100 },
      md: 4,
    },
    {
      name: "html",
      label: "HTML",
      size: "small",
      type: "text",
      fullWidth: true,
      inputProps: {
        style: { fontSize: "1.0rem", fontFamily: "Overpass Variable" },
      },
      multiline: true,
      rows: 12,
      md: 12,
    },
  ];

  const crumbDefs = !fetchEasyGuide && [
    {
      to: "/egc",
      crumbName: "Easy Guide",
    },
    {
      to: navEasyGuideCatLink(easyGuide.easyGuideCategory.id),
      crumbName: easyGuide.easyGuideCategory.name,
    },
    {
      crumbName: easyGuide.title,
    },
  ];

  const hue = randomHue();
  console.log("hue=", hue);

  return (
    <Spinner open={fetchingEasyGuide}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />
          {easyGuide.fragments.map((report) => (
            <Report
              key={report.id}
              hue={hue}
              report={{ ...report, chapter }}
              onEdit={() =>
                openDialog("dataEntry", {
                  key: report.id,
                  title: "Update report",
                  dataQueryKeys: ["reports"],
                  fields: reportFields,
                  mutationApi: "updateReport",
                  defaultValues: {
                    ...report,
                    review: report.review ? "yes" : "no",
                    hide: report.hide ? "yes" : "no",
                  },
                  basePayload: { reportId: report.id },
                  deleteApi: isAdmin ? "deleteReport" : null,
                  deletePayload: {
                    reportId: report.id,
                  },
                })
              }
            />
          ))}
        </Stack>
      </Container>
      <FabAddButton
        buttonText="Report"
        dataEntryProps={{
          key: `addreport${nextSeqNo}`,
          title: "Add report",
          fields: reportFields.concat(reportFragFields),
          dataQueryKeys: ["reports"],
          onlyDirty: false,
          mutationApi: "addReportFrag",
          basePayload: { chapterId: chapter.id },
        }}
      />
    </Spinner>
  );
};
