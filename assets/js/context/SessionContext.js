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
      name
      email
      avatarUrl
      isAdmin
    }
  }`).then(({ userInfo }) => userInfo);

const SessionProvider = (props) => {
  const theme = useTheme();
  const onTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const userInfoQueryKey = "userInfo";
  const { data: userInfo = {}, isFetching: fetchingUserInfo } = useQuery(
    [userInfoQueryKey],
    fetchUserInfo
  );

  const queryClient = useQueryClient();
  const logout = () => queryClient.invalidateQueries([userInfoQueryKey]);

  return (
    <SessionContext.Provider
      value={{
        onTablet,
        logout,
        ...userInfo,
      }}
    >
      <BackdropLoader open={fetchingUserInfo} />
      {props.children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
