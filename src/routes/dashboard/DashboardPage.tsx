import { AutoCenter } from "antd-mobile";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../App";

export function DashboardPage() {
  const auth = useAuth();
  return (
    <>
      <AutoCenter>Hello {auth.user?.displayName}</AutoCenter>
    </>
  );
}
