import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import parse from "html-react-parser";
import Box from "@mui/material/Box";
import Report from "./Report";
import BreadCrumbs from "../kmui/BreadCrumbs";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import FabAddButton from "../kmui/FabAddButton";
import Spinner from "../kmui/Spinner";
import { HEADER_HEIGHT } from "../consts";
import { navEasyGuideCatLink } from "../utils/app";
import Badge from "@mui/material/Badge";
import { randomHue } from "../utils/sys";
import truncate from "lodash/truncate";
import ContentWrapper from "../kmui/ContentWrapper";
import { Heading4, Heading5 } from "../kmui/Heading";

const fetchEasyGuide = ({ queryKey: [, guideId] }) =>
  request(`{
    easyGuide(id: ${guideId}) {
      id
      title
      abbreviated
      easyGuideFragments {
        id
        fragSeqNo
        html
        reportId
        report {
          id
          chapterId
          reportNo
          headingEng
          review
          hide 
          notes
          chapter {
            id
            chapterNo
            nameEng
            section {
              id
              sectionNo
              nameEng
              book {
                id
                code
                volumeNo
                nameEng
              }
            }
          }
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
  const { isAdmin, onPhone, onTablet, onDesktop } =
    React.useContext(SessionContext);
  const { guideId } = useParams();
  const { data: easyGuide = {}, isFetching: fetchingEasyGuide } = useQuery(
    ["easyGuide", guideId],
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

  const crumbDefs = !fetchingEasyGuide && [
    {
      to: "/egc",
      crumbName: "Easy Guide",
    },
    {
      to: navEasyGuideCatLink(easyGuide.easyGuideCategory?.id),
      crumbName: easyGuide.easyGuideCategory?.name,
    },
    {
      crumbName: truncate(easyGuide.title, {
        length: onPhone ? 40 : onTablet ? 80 : 120,
        separator: " ",
      }),
    },
  ];

  const hue = randomHue();
  const updateFragmentDialogProps = (fragment) => ({
    key: fragment.id,
    title: "Update Fragment",
    dataQueryKeys: ["easyGuide"],
    fields: fragmentFields,
    mutationApi: "updateEasyGuideFragment",
    defaultValues: fragment,
    basePayload: { id: fragment.id },
    deleteApi: "deleteEasyGuideFragment",
    deletePayload: {
      id: fragment.id,
    },
  });

  return (
    <Spinner open={fetchingEasyGuide}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <ContentWrapper>
        <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />

        <Heading4>EASY GUIDE</Heading4>
        <Heading5>{easyGuide.title}</Heading5>
        {easyGuide.easyGuideFragments?.map((f) => {
          return (
            <Badge
              key={f.id}
              badgeContent={f.fragSeqNo}
              invisible={!isAdmin}
              color="primary"
            >
              {f.report ? (
                <Report
                  key={f.id}
                  hue={hue}
                  lightness={96}
                  report={{ ...f.report, chapter: f.report.chapter }}
                  dataQueryKeys={["easyGuide"]}
                  onFragmentEdit={() => {
                    openDialog("dataEntry", updateFragmentDialogProps(f));
                  }}
                />
              ) : (
                <Box key={f.id}>
                  {parse(f.html)}
                  {isAdmin && (
                    <EditNoteIcon
                      sx={{ marginRight: 3 }}
                      size="small"
                      onClick={(e) => {
                        openDialog("dataEntry", updateFragmentDialogProps(f));
                        e.stopPropagation();
                      }}
                    />
                  )}
                </Box>
              )}
            </Badge>
          );
        })}
      </ContentWrapper>
      <FabAddButton
        buttonText="Fragment"
        dataEntryProps={{
          key: "TBD",
          title: "Add fragment",
          fields: fragmentFields,
          dataQueryKeys: ["easyGuide"],
          onlyDirty: false,
          mutationApi: "addEasyGuideFragment",
          basePayload: { easyGuideId: easyGuide.id },
        }}
      />
    </Spinner>
  );
};
