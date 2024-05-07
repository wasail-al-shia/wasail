import React from "react";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DialogContext } from "../context/DialogContext";
import { SessionContext } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import FabAddButton from "../kmui/FabAddButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Spinner from "../kmui/Spinner";
import Badge from "@mui/material/Badge";
import { HEADER_HEIGHT } from "../consts";
import Container from "@mui/material/Container";
import { navEasyGuideCatLink } from "../utils/app";

const fetchCategories = () =>
  request(`{
    easyGuideCategories {
      id 
      name
      description
      catSeqNo
    }
  }`).then(({ easyGuideCategories }) => easyGuideCategories);

export default () => {
  const navigate = useNavigate();
  const { openDialog } = React.useContext(DialogContext);
  const { isAdmin } = React.useContext(SessionContext);
  const { data: categories = [], isFetching: isFetching } = useQuery(
    ["easyGuideCategories"],
    fetchCategories
  );

  const categoryDialogFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      fullWidth: true,
      size: "small",
      rules: { required: true },
      md: 6,
    },
    {
      name: "catSeqNo",
      label: "Cat Seq No",
      type: "number",
      rules: { required: true },
      size: "small",
      md: 4,
      sx: { width: 150 },
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      size: "small",
      rules: { required: true },
      fullWidth: true,
      multiline: true,
      rows: 3,
      md: 12,
    },
  ];

  const updateCategoryDialogProps = (category) => ({
    key: category.id,
    title: "Update Category",
    dataQueryKeys: ["easyGuideCategories"],
    fields: categoryDialogFields,
    mutationApi: "updateEasyGuideCategory",
    defaultValues: category,
    basePayload: { id: category.id },
    deleteApi: "deleteCategory",
    deletePayload: {
      id: category.id,
    },
  });

  const CategoryCard = ({ idx, category }) => (
    <Stack
      sx={{
        width: "100%",
        padding: "0.5rem",
        backgroundColor: "primary.header2",
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "primary.header1",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(navEasyGuideCatLink(category.id))}
      direction="column"
    >
      <Typography variant="h5">
        {`${idx + 1}. ${category.name}`}
        {isAdmin && (
          <EditNoteIcon
            sx={{ marginRight: 3 }}
            size="small"
            onClick={(e) => {
              openDialog("dataEntry", updateCategoryDialogProps(category));
              e.stopPropagation();
            }}
          />
        )}
      </Typography>
      <Typography>{category.description}</Typography>
    </Stack>
  );

  return (
    <Spinner open={isFetching}>
      <Box sx={{ height: `calc(1 * ${HEADER_HEIGHT})` }} />
      <Container maxWidth="lg">
        <Stack sx={{ marginTop: 10 }} spacing={3}>
          <Typography
            sx={{ color: "primary.dark2" }}
            variant="h4"
            align="center"
          >
            EASY GUIDE TO ISLAMIC PRACTICES
          </Typography>
          <Typography variant="h6">
            Each guide is a curated collection of hadith that concisely covers
            essential areas of fiqh in an accessible yet comprehensive way
            providing quick access to the most crucial and practical knowledge
            relevant to everyday life without being overwhelmed by the sheer
            number of narrations. While this guide covers the most common
            situations and scenarios, we encourage you to explore the more
            extensive collection of hadith for less frequent or unique
            circumstances.
          </Typography>
          {categories.map((category, idx) => (
            <Badge
              key={category.id}
              badgeContent={category.catSeqNo}
              invisible={!isAdmin}
              color="primary"
            >
              <CategoryCard key={category.id} idx={idx} category={category} />
            </Badge>
          ))}
        </Stack>
        <FabAddButton
          buttonText="Category"
          dataEntryProps={{
            title: "Add Category",
            fields: categoryDialogFields,
            dataQueryKeys: ["easyGuideCategories"],
            mutationApi: "addEasyGuideCategory",
          }}
        />
      </Container>
    </Spinner>
  );
};
