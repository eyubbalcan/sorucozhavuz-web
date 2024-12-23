import { ToastContainer } from "react-toastify";
import { FullPageLoader, Header } from "../../components";
import "./App.scss";
import React from "react";
import { isAuthenticated } from "../../utils";
import { Dashboard, LoginForm } from "..";
import { alertOptions } from "./alertOptions";

const App: React.FC = () => {
  const showApp = () => {
    if (isAuthenticated()) {
      return (
        <div className="container-fluid p-0">
          <Header />
          <Dashboard />
        </div>
      );
    }

    return <LoginForm />;
  };

  return (
    <>
      {showApp()}
      <ToastContainer {...alertOptions} />
      <FullPageLoader />
    </>
  );
};

export default App;
