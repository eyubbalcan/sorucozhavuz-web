import "./Question.scss";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, ImageCropModal } from "../../components";
import _ from "lodash";
import * as SERVICES from "../../services";
import * as CONSTANTS from "../../constants";
import { toast } from "react-toastify";
import {
  // IAddQuestionAndSolveReq,
  // IAddQuestionReq,
  ILessonRes,
} from "../../models";
import { useDropzone } from "react-dropzone";
import { checkRoles } from "../../utils";

const publishers = ["Hız Yayınları", "3D Yayınları"];

const QuestionSend: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [testName, setTestName] = useState<string>("");
  const [questionPhoto, setQuestionPhoto] = useState<string | null>(null);
  const [answerPhoto, setAnswerPhoto] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<string | null>(null);
  const [shapePhoto, setShapePhoto] = useState<string | null>(null);

  const [lessons, setLessons] = useState<ILessonRes[]>([]);
  const [step, setStep] = useState<number>(0);
  const [uploadType, setUploadType] = useState<number>(0);

  useEffect(() => {
    SERVICES.GetLessons().then((res) => {
      setLessons(res.data);
    });

    return () => {};
  }, []);

  const onClear = () => {
    switch (step) {
      case 1:
        setQuestionPhoto(null);
        break;
      case 2:
        setAnswerPhoto(null);
        break;
      case 3:
        setAnswerText("");
        break;
      case 4:
        setShapePhoto(null);
        break;
    }
  };

  const onSubmit = () => {
    setStep(1);
  };

  const onBack = () => {
    switch (step) {
      case 1:
        setStep(0);
        break;
      case 2:
        setStep(1);
        break;
      case 3:
        setStep(2);
        break;
      case 4:
        setStep(3);
        break;
      case 5:
        setStep(4);
        break;
      default:
        break;
    }
  };

  const onNext = () => {
    switch (step) {
      case 0:
        if (
          _.isEmpty(selectedLesson) ||
          _.isEmpty(publisher) ||
          _.isEmpty(testName)
        ) {
          toast.error("Lütfen tüm alanları doldurun.");
          return;
        }
        setStep(1);
        break;
      case 1:
        if (_.isEmpty(questionPhoto)) {
          toast.error("Lütfen soru ekleyin.");
          return;
        }
        setStep(2);
        break;
      case 2:
        if (_.isEmpty(answerPhoto)) {
          toast.error("Lütfen cevap ekleyin.");
          return;
        }
        setStep(3);
        break;
      case 3:
        if (_.isEmpty(answerText)) {
          toast.error("Lütfen metin ekleyin.");
          return;
        }
        setStep(4);
        break;
      case 4:
        if (
          _.isEmpty(shapePhoto) &&
          selectedLesson ===
            lessons.find((x) => x.name.toLocaleLowerCase() === "geometri")?._id
        ) {
          toast.error("Lütfen şekil ekleyin.");
          return;
        }
        setStep(5);
        break;
      default:
        break;
    }
  };

  const uploadMethods = () => {
    switch (step) {
      case 1:
        return {
          value: questionPhoto,
          setValue: setQuestionPhoto,
        };
      case 2:
        return {
          value: answerPhoto,
          setValue: setAnswerPhoto,
        };
      case 3:
        return {
          value: answerText,
          setValue: setAnswerText,
        };
      case 4:
        return {
          value: shapePhoto,
          setValue: setShapePhoto,
        };
      default:
        return {
          value: null,
          setValue: () => null,
        };
    }
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setQuestionPhoto(URL.createObjectURL(imageFiles[0]));
  }, []);

  const onSave = (croppedImage: string, croppedFile: File) => {
    if (!_.isElement(croppedFile) && !_.isNil(croppedImage)) {
      setQuestionPhoto(croppedImage);
      // let imageId = "";
      // SERVICES.UploadImageFile({ file: croppedFile }).then((response) => {
      //   imageId = response.data._id;
      //   if (_.isEmpty(imageId)) {
      //     toast.error("Resim yüklenemedi");
      //     return;
      //   }

      //   SERVICES.AddQuestion({
      //     lesson: selectedLesson,
      //     question: imageId,
      //   }).then(() => {
      //     toast.success("Soru başarıyla yüklendi");
      //   });

      //   return true;
      // });
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
    },
  });

  const uploadArea = useMemo(() => {
    switch (uploadType) {
      case 1:
        return (
          <div
            {...getRootProps()}
            className="file-drop-zone border rounded border-dashed p-4"
            style={{ minHeight: "100px" }}
          >
            <input {...getInputProps()} />
            {isDragAccept && <p>Doğru dosya formatı.</p>}
            {isDragReject && <p>Desteklenen formatlar: gif, jpg, jpeg, png</p>}
            {!isDragActive && (
              <p>
                Dosyaları buraya bırakın veya bu alana tıklayıp dosya seçiniz.
              </p>
            )}
          </div>
        );

      case 2:
        return (
          <Camera
            onSave={onSave}
            setPhoto={() => uploadMethods().setValue(null)}
            photo={uploadMethods().value}
          />
        );

      default:
        return <></>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadType]);

  const step1 = useMemo(() => {
    if (_.isEmpty(lessons)) return <p>{CONSTANTS.Strings.LOADING}</p>;

    return (
      <div className="row mt-3 justify-content-center">
        <div className="col-sm-12 col-md-6">
          <select
            onChange={(e) => {
              setSelectedLesson(e.target.value);
            }}
            className="form-select form-select-lg mb-3"
            defaultValue={selectedLesson}
          >
            <option value={""}>Ders Seçiniz</option>
            {lessons.map((lesson) => (
              <option key={lesson._id} value={lesson._id}>
                {lesson.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => {
              setPublisher(e.target.value);
            }}
            className="form-select form-select-lg mb-3"
            defaultValue={publisher}
          >
            <option value={""}>Yayınevi Seçiniz</option>
            {publishers
              .sort((a, b) => a.localeCompare(b))
              .map((publisher) => (
                <option key={publisher} value={publisher}>
                  {publisher}
                </option>
              ))}
          </select>
          <input
            type="text"
            className="form-control"
            placeholder="Test Adı"
            value={testName}
            onChange={(e) => {
              setTestName(e.target.value);
            }}
          />
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons, testName, step]);

  const step2 = useMemo(() => {
    return (
      <>
        <div className="row mt-3 justify-content-center">
          <div className="col-sm-12 col-md-6 text-center">
            <h5>Soru</h5>
            <div className="row mt-3 justify-content-center">
              <div className="col-sm-12 col-md-6">
                {_.isEmpty(uploadMethods().value) ? (
                  uploadType > 0 && !_.isNil(uploadArea) && uploadArea
                ) : (
                  <img
                    src={uploadMethods().value ?? ""}
                    alt="upload"
                    className="img-fluid"
                    width="90%"
                  />
                )}
              </div>
            </div>
            <div className="button-conatiner" role="group">
              <div>
                <button
                  type="button"
                  className="next-btn"
                  disabled={step > 1}
                  onClick={() => {
                    setUploadType(2);
                  }}
                >
                  Fotoğraf Çek
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="next-btn"
                  disabled={step > 1}
                  onClick={() => {
                    setUploadType(1);
                  }}
                >
                  Dosya Seç
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }, [step, uploadMethods, uploadType, uploadArea]);

  return (
    <div className="container p-3">
      <div className="step-container">
        <div className="steps">
          <div>
            <div className={`step ${step === 0 ? "active" : undefined}`}>1</div>
            <span>Ders</span>
          </div>
          <div>
            <div className={`step ${step === 1 ? "active" : undefined}`}>2</div>
            <span>Soru</span>
          </div>
          <div>
            <div className={`step ${step === 2 ? "active" : undefined}`}>3</div>
            <span>Görsel</span>
          </div>
          <div>
            <div className={`step ${step === 3 ? "active" : undefined}`}>4</div>
            <span>Metin</span>
          </div>
          <div>
            <div className={`step ${step === 4 ? "active" : undefined}`}>5</div>
            <span>Şekil</span>
          </div>
          <div>
            <div className={`step ${step === 5 ? "active" : undefined}`}>6</div>
            <span>Son</span>
          </div>
        </div>
      </div>
      {step === 0 && step1}
      {step === 1 && step2}

      {checkRoles(CONSTANTS.Roles.TESTER_SOLVER) && (
        <div className="row mt-3 justify-content-center">
          <div className="col-sm-12 col-md-6"></div>
        </div>
      )}
      {!_.isNil(questionPhoto) && uploadType === 1 && (
        <ImageCropModal
          imageUrl={questionPhoto}
          onClose={() => {
            setQuestionPhoto(null);
          }}
          onSave={onSave}
        />
      )}
      <div className="row mt-3 justify-content-center">
        <div className="actions">
          <button className="back-btn ms-2" onClick={onBack}>
            ← GERİ
          </button>
          {(step === 1 || step === 2 || step === 3 || step === 4) && (
            <button className="back-btn" onClick={onClear}>
              TEMİZLE
            </button>
          )}
          {step !== 5 && (
            <button className="next-btn me-2" onClick={onNext}>
              İLERİ <span className="material-icons">home</span>
            </button>
          )}
          {step === 5 && (
            <div className=" me-2">
              <button className="next-btn" onClick={onNext}>
                DEVAM ET
              </button>
              <button className="finish-btn" onClick={onSubmit}>
                BİTİR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSend;
