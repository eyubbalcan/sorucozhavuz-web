import "./main.scss";
import { createRoot } from "react-dom/client";
import App from "./pages/_root/App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter } from "react-router-dom";
// localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Rzb2x2ZXJAc2VkdXNzLmNvbSIsInN1YiI6IjY3NjUzMjJkMzcwZGQ5Zjk5M2I1NzVjMiIsInJvbGUiOiJTb2x2ZXIiLCJpYXQiOjE3MzQ2ODUyNTAsImV4cCI6MTczNzI3NzI1MH0.CKTqfF0VB5oRJt04tn95jqOOkwqOsY-dsFU3ejDNr8k");
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
