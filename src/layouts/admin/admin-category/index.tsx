import React, { useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { RouteType } from "../../../dummy-data/mockAdminRouteData";

interface CategoryAdminLayoutProps {
  categoriesPath: RouteType[];
}
export default function CategoryAdminLayout({ categoriesPath }: CategoryAdminLayoutProps) {
  const { activateCategoryLayout } = useOutletContext();

  useEffect(() => {
    activateCategoryLayout(categoriesPath);
    return () => {
      activateCategoryLayout([]);
    };
  }, [categoriesPath]);

  return (
    <div>
      <Outlet />
    </div>
  );
}
