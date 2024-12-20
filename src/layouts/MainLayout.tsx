import React from "react";
import Header from "../components/organisms/header";
import { Outlet } from "react-router-dom";
import Footer from "../components/organisms/footer";

function MainLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-3">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
