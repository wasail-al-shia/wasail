import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MainWrapper from "../framework/MainWrapper";
import Subheader from "../framework/Subheader";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import { formatIsoStrLocal, formatIsoStrDateTime } from "../utils/date";

const fetchMostRecentReport = () =>
  request(`{
    mostRecentReport {
      id
      insertedAt
    }
  }`).then(({ mostRecentReport }) => mostRecentReport);

export default () => {
  const { data: report = {} } = useQuery(
    ["mostRecentReport"],
    fetchMostRecentReport
  );

  console.log("report=", formatIsoStrLocal(report.insertedAt));
  return (
    <>
      <Subheader />
      <MainWrapper>
        <Stack
          spacing={10}
          sx={{
            backgroundColor: "primary.paper",
            marginTop: 5,
            padding: 5,
          }}
        >
          <Typography>
            Wasail Al Shia is a vast and comprehensive collection of shia
            hadith. It is a monumental work contributing significantly to the
            preservation and dissemination of Shia hadiths and jurisprudential
            teachings. It comprises of 30 volumes and consists of traditions
            from early Shia canonical books like Kutub-e-Araba (Four Books) and
            other sources. The hadiths were compiled by Shaykh al-Hurr al-Amili
            (d. 1693), who wrote in the introduction of this book, that for a
            long he had this idea in mind, to collect narrations about sharia
            and practical laws from reliable books. He spent twenty years to
            finish this compilation. May Allah elevate his status and reward him
            abundantly.
          </Typography>
          <Typography>
            This site presents an english translation of this important work.
            This is an ongoing effort and we expect it to continue for quite
            some time until we finish inshaAllah. New translations will be added
            on a regular basis, so please check back often.
          </Typography>
          <Typography>
            Note that we have omitted the transmission chains (sanad) because
            they can be looked up (if required) in the original arabic versions
            that are available online and can also be downloaded from this site.
          </Typography>
          <Typography>
            If you have any comments on the translation of a particular report
            please use the feedback/comment icon that is displayed next to each
            report to notify us. If you have any other questions please feel
            free to contact us.
          </Typography>
        </Stack>
        <Stack>
          <Typography sx={{ marginTop: 5 }} align="right" variant="footer">
            Site last updated on {formatIsoStrDateTime(report.insertedAt)}.
          </Typography>
        </Stack>
      </MainWrapper>
    </>
  );
};
