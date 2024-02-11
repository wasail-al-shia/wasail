import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { request } from "../utils/graph-ql";
import MainWrapper from "./MainWrapper";

const fetchSearchResults = ({ queryKey: [_, queryStr] }) =>
  request(`{
    searchResults(queryStr: "${queryStr}") {
      reportId
      matchingText
    }
  }`).then(({ searchResults }) => searchResults);

export default function () {
  const { queryStr } = useParams();
  const { data: searchResults = [], isFetching: searching } = useQuery(
    ["search", queryStr],
    fetchSearchResults
  );

  console.log("searchResults=", searchResults);

  return <MainWrapper>{searchResults.map((r) => r.matchingText)}</MainWrapper>;
}
