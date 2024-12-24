import React from "react";
import { getLocalFullName, isAuthenticated } from "../utils";
import { Link } from "react-router-dom";
import { Logout } from "../services";
import { Routes } from "../route";

const Header: React.FC = () => {
  if (!isAuthenticated()) return;

  return (
    <header className="bg-dark text-white">
      <nav className="navbar navbar-expand-lg navbar-dark px-3">
        <Link
          to={Routes.ROOT}
          className="navbar-brand"
          style={{ fontWeight: "800" }}
        >
          Seduss Soru Havuzu
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ fontWeight: "800" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                to={Routes.QUESTION_SEND}
                className="nav-link"
                style={{ fontWeight: "800" }}
              >
                Soru Gönder
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={Routes.QUESTION_LIST}
                className="nav-link"
                style={{ fontWeight: "800" }}
              >
                Sorular
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span>{getLocalFullName()}</span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Hesabım
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => Logout()}
                      href="#"
                    >
                      Çıkış
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
