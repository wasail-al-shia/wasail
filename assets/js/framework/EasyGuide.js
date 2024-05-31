import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import parse from "html-react-parser";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EgReport from "./EgReport";
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
import IconButton from "@mui/material/IconButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";
import { generateEasyGuidePdf } from "../utils/pdf";
import { replace } from "../utils/obj";

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
        heading
        list
        numberedList
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
  const { isAdmin, onPhone, onTablet } = React.useContext(SessionContext);
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
      name: "heading",
      label: "Heading",
      type: "text",
      size: "small",
      md: 12,
      fullWidth: true,
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
      rows: 4,
      md: 12,
    },
    {
      name: "numberedList",
      label: "Numbered List?",
      type: "radio",
      defaultValue: "no",
      md: 4,
      options: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    },
    {
      name: "list",
      label: "List (one item per line)",
      size: "small",
      type: "text",
      fullWidth: true,
      inputProps: {
        style: { fontSize: "1.0rem", fontFamily: "Overpass Variable" },
      },
      multiline: true,
      rows: 4,
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
    defaultValues: {
      ...fragment,
      numberedList: fragment.numberedList ? "yes" : "no",
    },
    basePayload: { id: fragment.id },
    deleteApi: "deleteEasyGuideFragment",
    transformPayload,
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
        <Heading5>
          {easyGuide.title}
          {isAdmin && (
            <Tooltip title="Download Easy Guide">
              <IconButton
                size="small"
                variant="contained"
                sx={{ color: "primary.dark2" }}
                onClick={() => generateEasyGuidePdf(easyGuide)}
              >
                <PictureAsPdfIcon size="small" />
              </IconButton>
            </Tooltip>
          )}
        </Heading5>
        <Stack spacing={3} sx={{ padding: 5 }}>
          {easyGuide.easyGuideFragments?.map((f) => {
            return (
              <Badge
                key={f.id}
                badgeContent={f.fragSeqNo}
                invisible={!isAdmin}
                color="primary"
                sx={{ width: "100%" }}
              >
                {f.report ? (
                  <EgReport
                    key={f.id}
                    report={{ ...f.report, chapter: f.report.chapter }}
                  />
                ) : (
                  <Box
                    sx={{
                      padding: 2,
                      fontSize: "1.1rem",
                    }}
                    key={f.id}
                  >
                    {f.heading && (
                      <Typography sx={{ mb: 3 }} variant="h5">
                        {f.heading}
                      </Typography>
                    )}
                    {parse(f.html)}
                    {f.list && (
                      <Box sx={{ pl: "2rem" }}>
                        <List
                          sx={{
                            listStyle: f.numberedList ? "decimal" : "disc",
                            p: 0,
                          }}
                        >
                          {f.list
                            .split("\n")
                            .filter((x) => x.trim().length > 0)
                            .map((line, idx) => (
                              <ListItem
                                key={idx + f.id}
                                sx={{ padding: 0, display: "list-item" }}
                              >
                                <ListItemText
                                  primaryTypographyProps={{
                                    variant: "textEng",
                                  }}
                                  primary={line}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    )}
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
        </Stack>
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
          transformPayload,
        }}
      />
    </Spinner>
  );
};

const transformPayload = (payload) => {
  return replace(payload, [
    {
      key: "numberedList",
      value: payload.numberedList == "yes" ? true : false,
    },
  ]);
};
