import { logo } from "../../assets/contant";

import { Link, Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

function AuthenticationLayout() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });
  return (
    <section className="min-h-screen bg-[#FEFBF0] flex flex-col">
      {/* Logo ở giữa, trên cùng */}
      <Outlet />
    </section>
  );
}

export default AuthenticationLayout;
