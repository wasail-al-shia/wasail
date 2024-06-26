import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DialogContext } from "../context/DialogContext";
import BreadCrumbs from "../kmui/BreadCrumbs";
import Spinner from "../kmui/Spinner";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SessionContext } from "../context/SessionContext";
import { HEADER_HEIGHT } from "../consts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { navEasyGuideLink } from "../utils/app";
import { replace } from "../utils/obj";
import { capitalizeFirstLetter } from "../utils/string";
import Badge from "@mui/material/Badge";

const fetchCategory = ({ queryKey: [_, categoryId] }) =>
  request(`{
    easyGuideCategory(categoryId: ${categoryId}) {
      id
      name
    }
  }`).then(({ easyGuideCategory }) => easyGuideCategory);

const fetchEasyGuides = ({ queryKey: [_, categoryId] }) =>
  request(`{
    easyGuides(categoryId: ${categoryId}) {
      id
      title
      abbreviated
      hide
      egSeqNo
    }
  }`).then(({ easyGuides }) => easyGuides);

export default () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { openDialog } = React.useContext(DialogContext);
  const { isReviewer, isAdmin } = React.useContext(SessionContext);
  const dataQueryKey = ["easyGuides", categoryId];
  const { data: easyGuides = [], isFetching: fetchingEasyGuides } = useQuery(
    dataQueryKey,
    fetchEasyGuides
  );
  const { data: easyGuideCategory = {}, isFetching: fetchingCategory } =
    useQuery(["easyGuideCategory", categoryId], fetchCategory);
  const easyGuideDialogFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      size: "small",
      rules: { required: true },
      fullWidth: true,
      md: 12,
    },
    {
      name: "abbreviated",
      label: "Abbreviated",
      type: "text",
      size: "small",
      rules: { required: true },
      md: 6,
    },
    {
      name: "egSeqNo",
      label: "Seq No",
      type: "number",
      rules: { required: true },
      size: "small",
      md: 4,
      sx: { width: 150 },
    },
    {
      name: "hide",
      label: "Hide?",
      type: "radio",
      md: 4,
      defaultValue: "yes",
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
  ];

  const crumbDefs = !fetchingCategory && [
    {
      to: "/egc",
      crumbName: "Easy Guide",
    },
    {
      crumbName: easyGuideCategory.name,
    },
  ];

  const updateEasyGuideDialogProps = (easyGuide) => ({
    key: easyGuide.id,
    title: "Update Easy Guide",
    dataQueryKeys: [dataQueryKey],
    fields: easyGuideDialogFields,
    mutationApi: "updateEasyGuide",
    defaultValues: { ...easyGuide, hide: easyGuide.hide ? "yes" : "no" },
    basePayload: { id: easyGuide.id },
    deleteApi: "deleteEasyGuide",
    transformPayload: (payload) => {
      return replace(payload, [
        {
          key: "hide",
          value: payload.hide == "yes" ? true : false,
        },
      ]);
    },
    deletePayload: {
      id: easyGuide.id,
    },
  });

  const EasyGuideCard = ({ easyGuide, idx }) => (
    <Stack
      sx={{
        width: "100%",
        backgroundColor: easyGuide.hide ? "primary.hide" : "primary.header3",
        borderRadius: 1,
        padding: "0.5rem",
        "&:hover": {
          backgroundColor: "primary.header2",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(navEasyGuideLink(easyGuide.id))}
      direction="column"
    >
      <Typography
        sx={{ color: easyGuide.hide ? "secondary.dark" : null }}
        variant="h6"
      >
        {`${idx + 1}. ${easyGuide.title}`}
        {isAdmin && (
          <EditNoteIcon
            sx={{ marginRight: 3 }}
            size="small"
            onClick={(e) => {
              openDialog("dataEntry", updateEasyGuideDialogProps(easyGuide));
              e.stopPropagation();
            }}
          />
        )}
      </Typography>
    </Stack>
  );

  return (
    <Spinner open={fetchingEasyGuides || fetchingCategory}>
      <BreadCrumbs crumbDefs={crumbDefs} />
      <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />
      <Container maxWidth="lg">
        <Stack sx={{ mt: 5 }} spacing={3}>
          <Typography
            sx={{ color: "primary.dark2" }}
            variant="h4"
            align="center"
          >
            EASY GUIDE
          </Typography>
          <Typography variant="h5" align="center">
            {easyGuideCategory.name}
          </Typography>
          {easyGuides
            .filter((r) => isReviewer || !r.hide)
            .map((easyGuide, idx) => (
              <Badge
                key={easyGuide.id}
                badgeContent={easyGuide.egSeqNo}
                invisible={!isAdmin}
                color="primary"
              >
                <EasyGuideCard
                  key={easyGuide.id}
                  idx={idx}
                  easyGuide={easyGuide}
                />
              </Badge>
            ))}
        </Stack>
      </Container>
      {isAdmin && (
        <Fab
          sx={{ paddingRight: 7 }}
          variant="extended"
          size="small"
          color="primary"
          onClick={() => {
            openDialog("dataEntry", {
              title: "Add Easy Guide",
              fields: easyGuideDialogFields,
              dataQueryKeys: ["easyGuides"],
              mutationApi: "addEasyGuide",
              transformPayload,
              basePayload: { easyGuideCategoryId: easyGuideCategory.id },
            });
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Easy Guide
        </Fab>
      )}
    </Spinner>
  );
};
const transformPayload = (payload) => {
  return replace(payload, [
    {
      key: "hide",
      value: payload.hide == "yes" ? true : false,
    },
    {
      key: "title",
      value: payload.title && capitalizeFirstLetter(payload.title),
    },
  ]);
};
