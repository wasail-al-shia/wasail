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
      egSeqNo
    }
  }`).then(({ easyGuides }) => easyGuides);

export default () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
  const { data: easyGuides = [], isFetching: fetchingEasyGuides } = useQuery(
    ["easyGuides", categoryId],
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
    dataQueryKeys: ["easyGuides"],
    fields: easyGuideDialogFields,
    mutationApi: "updateEasyGuide",
    defaultValues: easyGuide,
    basePayload: { id: easyGuide.id },
    deleteApi: "deleteEasyGuide",
    deletePayload: {
      id: easyGuide.id,
    },
  });

  const EasyGuideCard = ({ easyGuide }) => (
    <Stack
      sx={{
        width: "100%",
        backgroundColor: "primary.header3",
        borderRadius: 1,
        padding: 5,
        "&:hover": {
          backgroundColor: "primary.header2",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(navEasyGuideLink(easyGuide.id))}
      direction="column"
    >
      <Typography variant="h6">
        {`${easyGuide.egSeqNo}. ${easyGuide.title}`}
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
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={3}>
          <Box sx={{ height: `calc(2 * ${HEADER_HEIGHT})` }} />
          {easyGuides.map((easyGuide) => (
            <EasyGuideCard key={easyGuide.id} easyGuide={easyGuide} />
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
