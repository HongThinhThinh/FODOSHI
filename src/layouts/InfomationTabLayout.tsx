import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { DataTabType } from "../assets/contant";

interface InfomationTabLayoutProps {
  data: DataTabType[];
}
function InfomationTabLayout({ data }: InfomationTabLayoutProps) {
  const { opentab } = useOutletContext();

  useEffect(() => {
    opentab(data);
    return () => {
      opentab([]);
    };
  }, [data]);
  return (
    <>
      <Outlet />
    </>
  );
}

export default InfomationTabLayout;
