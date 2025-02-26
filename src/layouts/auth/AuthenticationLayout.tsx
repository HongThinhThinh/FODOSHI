import { logo } from "../../assets/contant";
import { Outlet } from "react-router-dom";

function AuthenticationLayout() {
  return (
    <section className="min-h-screen bg-[#FEFBF0] flex flex-col">
      {/* Logo ở giữa, trên cùng */}
      <div className="text-center my-6">
        <img src={logo} alt="Logo" className="inline-block w-[15%]" />
      </div>
      <Outlet />
    </section>
  );
}

export default AuthenticationLayout;
