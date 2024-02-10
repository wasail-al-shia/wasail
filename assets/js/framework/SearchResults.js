import React from "react";
import { useParams } from "react-router-dom";
import MainWrapper from "./MainWrapper";

export default function () {
  const { searchStr } = useParams();
  return (
    <MainWrapper>
      <div>{searchStr}</div>
    </MainWrapper>
  );
}
