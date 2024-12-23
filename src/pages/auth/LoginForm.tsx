import "./Auth.scss";
import React, { useState } from "react";
import { ILoginUser, LoginUser } from "../../models";
import { Logo1 } from "../../assets";
import * as Services from "../../services";
import * as CONSTANTS from "../../constants";
import {
  isAuthenticated,
  setLocalBranch,
  setLocalEmail,
  setLocalFullName,
  setLocalId,
  setLocalRole,
  setLocalToken,
} from "../../utils";

const LoginForm: React.FC = () => {
  const [user, setUser] = useState<ILoginUser>(new LoginUser());

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    Services.Login(user).then((token) => {
      setLocalToken(token.data.token);
      setLocalRole(token.data.role);
      while (true) {
        if (isAuthenticated()) break;
      }
      Services.GetUser().then((info) => {
        setLocalId(info.data._id);
        setLocalEmail(info.data.email);
        setLocalFullName(`${info.data.firstName} ${info.data.lastName}`);
        setLocalBranch(info.data.branch);
        window.location.href = window.location.pathname;
      });
    });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setUser((previous) => ({ ...previous, [name]: value }));
  };

  const validate = (): boolean => {
    return user.email.length > 0 && user.password.length > 0;
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit} className="text-center">
          <img src={Logo1} alt="" className="mb-3" width={100} />
          <h3 className="mb-5">{CONSTANTS.Strings.LOGIN_TEXT}</h3>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control"
              onChange={handleChange}
              name="email"
              id="email"
              placeholder={CONSTANTS.Strings.EMAIL}
              autoFocus
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              onChange={handleChange}
              name="password"
              id="password"
              placeholder={CONSTANTS.Strings.PASSWORD}
            />
          </div>
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-success mb-3"
              color="success"
              disabled={!validate()}
            >
              {CONSTANTS.Strings.LOGIN}
            </button>
          </div>
          {/* {installable && <Button type='button' color='primary' className='mb-2' onClick={handleInstallClick} label={<CONSTANTS.GameIcons.GiSmartphone size={CONSTANTS.Sizes.PHONEBUTTON} />} />} */}
          <div className="d-grid gap-2">
            <a
              href="mailto:info@seduss.com"
              className="h6 text-decoration-none fw-bold mt-3 link-dark "
              style={{
                fontSize: "12px",
              }}
            >
              Seduss <sup>&copy;</sup> {new Date().getFullYear()}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
