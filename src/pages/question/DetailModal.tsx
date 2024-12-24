import React from "react";
import "react-image-crop/dist/ReactCrop.css";
import _ from "lodash";
import { IQuestionRes } from "../../models";

interface IDetailModalProps {
  question: IQuestionRes;
  onClose: () => void;
}

const DetailModal: React.FC<IDetailModalProps> = ({ question, onClose }) => {
  
  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Kontrol Ekranı</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body d-flex justify-content-center align-items-center">
            {_.question. ? (
                      <div className="row mt-3 justify-content-center">
                        <div className="col-sx-12 col-md-3 m-3 centered-container">
                          <img
                            src={questionPhoto ?? ""}
                            alt="question"
                            className="img-fluid "
                            style={{ height: "300px", alignItems: "center" }}
                          />
                        </div>
                        <div className="col-sx-12 col-md-3 m-3 centered-container">
                          <img
                            src={answerPhoto ?? ""}
                            alt="question"
                            className="img-fluid"
                            style={{ height: "300px" }}
                          />
                        </div>
                        <div className="col-sx-12 col-md-3 m-3 centered-container">
                          <textarea
                            className=""
                            readOnly
                            style={{
                              minWidth: "300px",
                              minHeight: "300px",
                              resize: "none",
                              overflowX: "auto",
                              whiteSpace: "pre-line",
                            }}
                            value={answerText || ""}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row mt-3 justify-content-center">
                          <div className="col-sm-12 col-md-4 m-3 centered-container">
                            <img
                              src={questionPhoto ?? ""}
                              alt="question"
                              className="img-fluid"
                              style={{ height: "300px" }}
                            />
                          </div>
                          <div className="col-sm-12 col-md-4 m-3 centered-container">
                            <img
                              src={answerPhoto ?? ""}
                              alt="question"
                              className="img-fluid"
                              style={{ height: "300px" }}
                            />
                          </div>
                        </div>
                        <div className="row justify-content-center">
                          <div className="col-sm-12 col-md-4 m-3 centered-container">
                            <div>
                              <textarea
                                className=""
                                readOnly
                                style={{
                                  minWidth: "300px",
                                  minHeight: "300px",
                                  resize: "none",
                                  overflowX: "auto",
                                  whiteSpace: "pre-line",
                                }}
                                value={answerText || ""}
                              />
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-4 m-3 centered-container">
                            <img
                              src={shapePhoto ?? ""}
                              alt="question"
                              className="img-fluid"
                              style={{ height: "300px" }}
                            />
                          </div>
                        </div>
                      </>
                    )}
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={onClose}>
              Kapat
            </button>
            <div className="btn-group">
              <button
                className="btn btn-danger"
                onClick={() => {
                  onClose();
                }}
              >
                Reddet
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  onClose();
                }}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
