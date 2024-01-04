import React, { useContext, useEffect } from "react";
import { Button } from "../../../components";
import { toast } from "react-hot-toast";
import {
  createSeedDataForUser,
  createUser,
  loginUser,
} from "../../../services/userAPIcalls";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../contexts/auth.context";
import { useQueryClient } from "react-query";
import { createDashboard } from "../../../services/dashboardAPIcalls";
import useDashboardData from "../hooks/useDashboardData";
import useWindowSize from "../../../hooks/useWindowSize";

const OneClickGuestLogin = (props) => {
  const { isLoggedIn, setIsLoggedIn, userId, authLoading, fetchAuthStatus } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const { refetchDashboardData } = useDashboardData({
    isLoggedIn,
    authLoading,
    userId,
  });

  const isWindowSmall = useWindowSize(1000);

  const handleGuestLogin = async () => {
    let toastId = null;
    let uniqueId = String(uuid());
    let username = `Guest ${uniqueId.slice(0, 4)}`;
    let password = String(uuid());
    await fetchAuthStatus();

    try {
      // ------ create guest account ------
      toastId = toast("Creating guest account...", {
        autoClose: false,
        position: "bottom-center",
      });
      const userData = await createUser(username, password, true); // isTempAccount = true - flag to delete account later
      toast.dismiss(toastId);

      if (!userData.username) {
        throw new Error(userData.message);
      }

      // ------ login to guest account ------
      const loginData = await loginUser(username, password);

      if (!loginData.user) {
        throw new Error(loginData.message);
      }

      await fetchAuthStatus();
      toast.success("Guest account setup complete", {
        autoClose: 5000,
        position: "bottom-center",
      });

      // ------ create one sample dashboard ------
      toastId = toast("Creating sample dashboard...", {
        autoClose: false,
        position: "bottom-center",
      });

      await createDashboard({
        name: "Sample 1",
      });

      // refetchDashboardData();
      setIsLoggedIn(true);
      localStorage.removeItem("lastSelectedDashboardId");

      // clear the demo queries and remove them
      queryClient.setQueryData(["dashboards", "user"], null);
      queryClient.setQueryData("widgets", null);
      queryClient.removeQueries(["dashboards", "user"]);
      queryClient.removeQueries("widgets");

      toast.dismiss(toastId);
      toast.success("Sample dashboard created", {
        autoClose: 4000,
        position: "bottom-center",
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      queryClient.removeQueries("dashboards");
      queryClient.removeQueries("widgets");
    }
  }, [isLoggedIn, queryClient]);

  return (
    <div>
      <Button
        onClick={handleGuestLogin}
        isLoading={authLoading}
        variant="secondary"
        className="bg-green-500/90 py-2 h-auto my-auto"
      >
        Guest Login
        {/* {isWindowSmall ? "Guest Login" : "One Click Guest Login"} */}
      </Button>
    </div>
  );
};

export default OneClickGuestLogin;
