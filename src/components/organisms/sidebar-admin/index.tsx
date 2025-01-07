import { Link } from "react-router-dom";
import { logo } from "../../../assets/contant";
import { RouteType } from "../../../dummy-data/mockAdminRouteData";

export default function SidebarAdmin({
  routes,
  currentPath,
}: {
  routes: RouteType[];
  currentPath: string;
}) {
  return (
    <div className="admin-layout-custom__container__sidebar">
      <div className="admin-layout-custom__container__sidebar__logo">
        <img src={logo} />
      </div>
      <div className="admin-layout-custom__container__sidebar__navigate">
        {routes.map((route, index) => (
          <Link to={route.path} key={index}>
            <div
              className={`admin-layout-custom__container__sidebar__navigate__item ${
                currentPath === route.path
                  ? "admin-layout-custom__container__sidebar__navigate__item--active"
                  : ""
              } `}
            >
              <div className="admin-layout-custom__container__sidebar__navigate__item__icon">
                {route.icon}
              </div>
              <div className="admin-layout-custom__container__sidebar__navigate__item__name">
                {route.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
