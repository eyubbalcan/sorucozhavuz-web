import "./FullPageLoader.scss";
import { Loader } from "../assets";
import * as CONSTANTS from "../constants";

const FullPageLoader = () => {
  return (
    <div className={CONSTANTS.LOADER_CONTAINER}>
      <div className="heartbeat text-center">
        <img src={Loader} alt="Loader" className="loader-image" />
      </div>
    </div>
  );
};

export default FullPageLoader;
