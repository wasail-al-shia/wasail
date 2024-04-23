import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { request } from "../utils/graph-ql";
import { useQuery, useQueryClient } from "react-query";
import BackdropLoader from "../kmui/BackdropLoader";

const SessionContext = React.createContext();

const fetchUserInfo = () =>
  request(`{
    userInfo {
      uid
      name
      email
      avatarUrl
      isAdmin
      isReviewer
    }
  }`).then(({ userInfo }) => userInfo);

const fetchMostRecentReport = () =>
  request(`{
    mostRecentReport {
      id
      reportNo
      insertedAt
      chapter {
        id
        chapterNo
      }
    }
  }`).then(({ mostRecentReport }) => mostRecentReport);

const SessionProvider = (props) => {
  const theme = useTheme();
  const onTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const userInfoQueryKey = "userInfo";
  const { data: userInfo = {}, isFetching: fetchingUserInfo } = useQuery(
    [userInfoQueryKey],
    fetchUserInfo
  );

  const { data: mostRecentReport = {} } = useQuery(
    ["mostRecentReport"],
    fetchMostRecentReport
  );

  const queryClient = useQueryClient();
  const logout = () => queryClient.invalidateQueries([userInfoQueryKey]);

  return (
    <SessionContext.Provider
      value={{
        onTablet,
        logout,
        mostRecentReport,
        ...userInfo,
      }}
    >
      <BackdropLoader open={fetchingUserInfo} />
      {props.children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
