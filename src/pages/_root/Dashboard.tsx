import React from "react";
import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "../../components";
import { QuestionSend, Home, NotFound } from "..";
import { Routes as path } from "../../route";
import QuestionList from "../question/QuestionList";

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route
        path={path.ROOT}
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path={path.QUESTION_SEND}
        element={
          <PrivateRoute>
            <QuestionSend />
          </PrivateRoute>
        }
      />
      <Route
        path={path.QUESTION_LIST}
        element={
          <PrivateRoute>
            <QuestionList />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Dashboard;
