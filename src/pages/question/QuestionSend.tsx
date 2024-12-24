import "./Question.scss";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera, ImageCropModal } from "../../components";
import _ from "lodash";
import * as SERVICES from "../../services";
import * as CONSTANTS from "../../constants";
import { toast } from "react-toastify";
import {
  IAddQuestionAndSolveReq,
  IAnswerTypeRes,
  // IAddQuestionAndSolveReq,
  // IAddQuestionReq,
  ILessonRes,
} from "../../models";
import { checkRoles } from "../../utils";

const publishers = ["Hız Yayınları", "3D Yayınları"];
const stepTitles = ["Ders", "Soru", "Görsel", "Metin", "Şekil", "Son"];
const classRooms = [
  "TYT",
  "AYT",
  "12.Sınıf",
  "11.Sınıf",
  "10.Sınıf",
  "9.Sınıf",
  "8.Sınıf",
  "7.Sınıf",
  "6.Sınıf",
  "5.Sınıf",
];

const QuestionSend: React.FC = () => {
  const [answerTypes, setAnswerTypes] = useState<IAnswerTypeRes[]>([]);
  const [lesson, setLesson] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [classRoom, setClassRoom] = useState<string>("");
  const [testName, setTestName] = useState<string>("");
  const [questionPhoto, setQuestionPhoto] = useState<string | null>(null);
  const [answerPhoto, setAnswerPhoto] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<string | null>(null);
  const [shapePhoto, setShapePhoto] = useState<string | null>(null);

  const [lessons, setLessons] = useState<ILessonRes[]>([]);
  const [step, setStep] = useState<number>(0);
  const [uploadType, setUploadType] = useState<number>(0);
  const [croppedUrl, setCropped] = useState<string | File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    SERVICES.GetAnswerTypes().then((answerType) => {
      setAnswerTypes(answerType.data);
      SERVICES.GetLessons().then((lesson) => {
        setLessons(lesson.data);
      });
    });

    return () => {};
  }, []);

  const onClear = () => {
    setUploadType(0);
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

  const onBack = () => {
    if (step <= 0) setStep(0);
    else setStep((x) => x - 1);
  };

  const onNext = () => {
    setUploadType(0);
    switch (step) {
      case 0:
        if (
          _.isEmpty(lesson) ||
          _.isEmpty(publisher) ||
          _.isEmpty(testName) ||
          _.isEmpty(classRoom)
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
          lesson ===
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

  const uploadMethods = useMemo(() => {
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
  }, [answerPhoto, answerText, questionPhoto, shapePhoto, step]);

  const firstStep = useMemo(() => {
    if (_.isEmpty(lessons)) return <p>{CONSTANTS.Strings.LOADING}</p>;

    return (
      <div className="row mt-3 justify-content-center">
        <div className="col-sm-12 col-md-6">
          <select
            onChange={(e) => {
              setLesson(e.target.value);
            }}
            className="form-select form-select-lg mb-3 "
            defaultValue={lesson}
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
          <select
            onChange={(e) => {
              setClassRoom(e.target.value);
            }}
            className="form-select form-select-lg mb-3"
            defaultValue={publisher}
          >
            <option value={""}>Sınıf Seçiniz</option>
            {classRooms.map((classRoom) => (
              <option key={classRoom} value={classRoom}>
                {classRoom}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control"
            placeholder="Test Adını Giriniz"
            value={testName}
            onChange={(e) => {
              setTestName(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }, [lesson, lessons, publisher, testName]);

  const uploadFile = useMemo(() => {
    return (
      <>
        <div className="row mt-3 justify-content-center text-center">
          {step === 1 ? (
            <h5>Sorunun Fotoğrafını Ekleyiniz.</h5>
          ) : step === 2 ? (
            <h5>Cevabın Fotoğrafı Ekleyiniz.</h5>
          ) : step === 4 ? (
            <h5>Şeklin Fotoğrafı Ekleyiniz.</h5>
          ) : (
            <></>
          )}
          <div className="col-sm-12 col-md-6">
            {uploadType === 2 ? (
              <Camera setPhoto={setCropped} />
            ) : (
              <img
                src={uploadMethods.value ?? "https://fakeimg.pl/300x300?text=+"}
                alt="upload"
                className="img-fluid"
                style={{ maxHeight: "300px" }}
              />
            )}
          </div>
        </div>
        {_.isEmpty(uploadMethods.value) && (
          <div className="d-flex mt-3 justify-content-center text-center">
            <div className="filed-buttons">
              <button className="next-btn" onClick={() => setUploadType(2)}>
                <span className="material-symbols-rounded">camera</span>
              </button>

              <div className="input-group">
                <input type="text" className="select-form" />
                <button
                  className="input-group-button"
                  onClick={() => {
                    setUploadType(1);
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  Gözat
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={(e) => {
                    if (_.isNil(e.target.files) || _.isEmpty(e.target.files))
                      return;
                    const file = e.target.files[0];
                    if (!_.isNil(file)) {
                      setCropped(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }, [uploadMethods.value, uploadType, step]);

  const textStep = useMemo(() => {
    return (
      <div className="row mt-3 justify-content-center">
        <div className="col-sm-12 col-md-6">
          <textarea
            className="form-control"
            placeholder="Metin Giriniz"
            value={answerText ?? ""}
            rows={8}
            onChange={(e) => {
              setAnswerText(e.target.value);
            }}
            style={{
              resize: "none",
              overflowX: "hidden",
              whiteSpace: "pre-line",
            }}
          />
        </div>
      </div>
    );
  }, [answerText]);

  const lastStep = useMemo(() => {
    return (
      <>
        {_.isEmpty(shapePhoto) ? (
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
      </>
    );
  }, [answerPhoto, answerText, questionPhoto, shapePhoto]);

  async function urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = "unknown";
    const mimeType = blob.type || "application/octet-stream";
    return new File([blob], fileName, { type: mimeType });
  }

  const afterSubmit = (isContinue: boolean): Promise<boolean> => {
    setQuestionPhoto(null);
    setAnswerPhoto(null);
    setAnswerText(null);
    setShapePhoto(null);
    if (isContinue) {
      setStep(1);
    } else {
      setLesson("");
      setPublisher("");
      setTestName("");
      setStep(0);
    }

    return Promise.resolve(true);
  };

  const getAnswerTypeId = (code: number): string => {
    return answerTypes.find((x) => x.code === code)?._id ?? "";
  };

  const onSubmit = async (isContinue: boolean) => {
    if (checkRoles(CONSTANTS.Roles.TESTER_SOLVER)) {
      if (
        _.isEmpty(lesson) ||
        _.isEmpty(publisher) ||
        _.isEmpty(testName) ||
        _.isEmpty(classRoom)
      ) {
        toast.error("Lütfen ders, yayınevi, sınıf ve test adını seçiniz");
        return;
      }

      const questionFile = await urlToFile(questionPhoto!);

      const questionImage = await SERVICES.UploadImageFile({
        file: questionFile,
      });

      if (_.isNil(questionImage.data) || _.isEmpty(questionImage.data._id)) {
        toast.error("Soru resmi yüklenemedi");
        return;
      }

      const payload: IAddQuestionAndSolveReq = {
        lesson,
        question: questionImage.data._id,
        answers: [],
      };

      const answerFile = await urlToFile(answerPhoto!);
      const answerImage = await SERVICES.UploadImageFile({
        file: answerFile,
      });

      if (_.isNil(answerImage.data) || _.isEmpty(answerImage.data._id)) {
        toast.error("Cevap resmi yüklenemedi");
        return;
      }

      payload.answers.push({
        answerType: getAnswerTypeId(1),
        fileAnswer: answerImage.data._id,
      });

      if (_.isEmpty(answerText)) {
        toast.error("Cevap metni boş olamaz");
        return;
      }

      payload.answers.push({
        answerType: getAnswerTypeId(2),
        textAnswer: answerText,
      });

      if (
        _.isEmpty(shapePhoto) &&
        lesson ===
          lessons.find((x) => x.name.toLocaleLowerCase() === "geometri")?._id
      ) {
        toast.error("Şekil ekleyiniz");
        return;
      }

      if (!_.isEmpty(shapePhoto)) {
        const shapeFile = await urlToFile(shapePhoto!);
        const shapeImage = await SERVICES.UploadImageFile({
          file: shapeFile,
        });

        if (_.isNil(shapeImage.data) || _.isEmpty(shapeImage.data._id)) {
          toast.error("Şekil yüklenemedi");
          return;
        }

        payload.answers.push({
          answerType: getAnswerTypeId(1),
          fileAnswer: shapeImage.data._id,
        });
      }

      payload.answers.push({
        answerType: getAnswerTypeId(2),
        textAnswer: publisher,
      });

      payload.answers.push({
        answerType: getAnswerTypeId(2),
        textAnswer: testName,
      });

      payload.answers.push({
        answerType: getAnswerTypeId(2),
        textAnswer: classRoom,
      });

      const question = await SERVICES.AddQuestionAndSolves(payload);

      if (question.status >= 200 && question.status < 300) {
        toast.success("Soru başarıyla yüklendi");
        await afterSubmit(isContinue);
        return;
      } else {
        toast.error("Soru yüklenemedi");
        return;
      }
    }

    if (checkRoles(CONSTANTS.Roles.TESTER)) {
      const questionFile = await urlToFile(questionPhoto!);

      const questionImage = await SERVICES.UploadImageFile({
        file: questionFile,
      });

      if (_.isNil(questionImage.data) || _.isEmpty(questionImage.data._id)) {
        toast.error("Resim yüklenemedi");
        return;
      }

      const question = await SERVICES.AddQuestion({
        lesson,
        question: questionImage.data._id,
      });

      if (question.status >= 200 && question.status < 300) {
        toast.success("Soru başarıyla yüklendi");
        await afterSubmit(isContinue);
        return;
      } else {
        toast.error("Soru yüklenemedi");
        return;
      }
    }

    if (checkRoles(CONSTANTS.Roles.SOLVER)) {
      console.log("SOLVER");
    }
  };

  return (
    <div className="container p-3">
      <div className="step-container">
        <div className="steps">
          {stepTitles.map((title, index) => (
            <div key={index}>
              <div className={`step ${step === index ? "active" : undefined}`}>
                {index + 1}
              </div>
              <span>{title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="row mt-3 justify-content-center"></div>
      {step === 0 && firstStep}
      {(step === 1 || step === 2 || step === 4) && uploadFile}
      {step === 3 && textStep}
      {step === 5 && lastStep}

      {checkRoles(CONSTANTS.Roles.TESTER_SOLVER) && (
        <div className="row mt-3 justify-content-center">
          <div className="col-sm-12 col-md-6"></div>
        </div>
      )}
      <div className="row mt-3 justify-content-center">
        <div className="actions">
          <div className="back-btn ms-2" onClick={onBack}>
            <span className="material-symbols-rounded">arrow_left_alt</span>
            <span className="align-middle">GERİ</span>
          </div>
          {step >= 1 && step <= 4 && (
            <div className="back-btn" onClick={onClear}>
              <span className="material-symbols-rounded">delete</span>
              <span className="align-middle">TEMİZLE</span>
            </div>
          )}
          {step !== 5 &&
            (checkRoles(
              CONSTANTS.Roles.TESTER_SOLVER,
              CONSTANTS.Roles.SOLVER
            ) ||
              step === 0) && (
              <div className="next-btn me-2" onClick={onNext}>
                <span className="align-middle">İLERİ</span>
                <span className="material-symbols-rounded">
                  arrow_right_alt
                </span>
              </div>
            )}
          {(step === 5 ||
            (!checkRoles(
              CONSTANTS.Roles.TESTER_SOLVER,
              CONSTANTS.Roles.SOLVER
            ) &&
              step === 1)) && (
            <div className="d-flex me-2">
              <div className="next-btn" onClick={() => onSubmit(true)}>
                <span className="align-middle">DEVAM</span>
                <span className="material-symbols-rounded">reply_all</span>
              </div>
              <div className="finish-btn" onClick={() => onSubmit(false)}>
                <span className="align-middle">BİTİR</span>
                <span className="material-symbols-rounded">send</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {!_.isNil(croppedUrl) && (
        <div className="text-center">
          <ImageCropModal
            imageUrl={
              croppedUrl instanceof File
                ? URL.createObjectURL(croppedUrl)
                : croppedUrl
            }
            onClose={() => {
              fileInputRef.current!.value = "";
              uploadMethods.setValue(null);
              setCropped(null);
              setUploadType(0);
            }}
            onSave={(url: string) => {
              if (_.isEmpty(url)) return;
              uploadMethods.setValue(url);
              setCropped(null);
              setUploadType(0);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionSend;
