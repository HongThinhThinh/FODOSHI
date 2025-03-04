import React from "react";
import Header from "../components/organisms/header";
import { Outlet } from "react-router-dom";
import Footer from "../components/organisms/footer";
import { useMediaQuery } from "react-responsive";

function MainLayout() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });
  return (
    <>
      <Header />
      <main
        className={`min-h-screen ${
          isBigScreen ? "mb-[80px] mt-[200px]" : "mb-[30px] mt-[100px]"
        } `}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
