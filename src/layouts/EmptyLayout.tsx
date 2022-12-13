import { SafeArea } from "antd-mobile";
import { Outlet } from "react-router-dom";

export function EmptyLayout() {
  return (
    <>
      <SafeArea position="top" />
      <Outlet />
      <SafeArea position="bottom" />
    </>
  );
}
