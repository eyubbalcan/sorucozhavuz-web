import "./Question.scss";
import React, { useEffect, useMemo, useState } from "react";
import * as SERVICES from "../../services";
import * as CONSTANTS from "../../constants";
import { ILessonRes, IQuestionRes } from "../../models";
import _ from "lodash";
import { checkRoles, getLocalId } from "../../utils";

const statusListForController = [
  "Çözülmeyen",
  "Çözülen",
  "Kontrol Edilmeyen",
  "Kontrol Edilen",
];
const statusListForSolver = ["Hepsi", "Onaylanan", "Onaylanmayan"];

const QuestionList: React.FC = () => {
  const [lessons, setLessons] = useState<ILessonRes[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<number>(-1);
  const [questions, setQuestions] = useState<IQuestionRes[]>([]);
  const [questionId, setQuestionId] = useState<IQuestionRes>();

  useEffect(() => {
    SERVICES.GetLessons().then((res) => {
      setLessons(res.data);
    });

    return () => {
      setLessons([]);
      setQuestions([]);
    };
  }, []);

  const getQuestions = async () => {
    if (_.isEmpty(selectedLesson)) {
      setQuestions([]);
      return;
    }

    if (checkRoles(CONSTANTS.Roles.ADMIN, CONSTANTS.Roles.CONTROLLER)) {
      switch (selectedStatus) {
        case 0: {
          const res = await SERVICES.GetUnsolvedQuestionsByLesson(
            selectedLesson
          );
          if (res.status >= 200 && res.status < 300) setQuestions(res.data);
          return;
        }
        case 1: {
          const res = await SERVICES.GetSolvedQuestionsByLesson(selectedLesson);
          if (res.status >= 200 && res.status < 300) setQuestions(res.data);
          return;
        }
        case 2: {
          const res = await SERVICES.GetUnControlQuestionsByLesson(
            selectedLesson
          );
          if (res.status >= 200 && res.status < 300) setQuestions(res.data);
          return;
        }
        case 3: {
          const res = await SERVICES.GetControlledQuestionsByLesson(
            selectedLesson
          );
          if (res.status >= 200 && res.status < 300) setQuestions(res.data);
          return;
        }
        default:
          setQuestions([]);
          return;
      }
    } else if (
      checkRoles(CONSTANTS.Roles.SOLVER, CONSTANTS.Roles.TESTER_SOLVER)
    ) {
      switch (selectedStatus) {
        case 0: {
          const res = await SERVICES.GetQuestionBySolver(getLocalId());
          if (res.status >= 200 && res.status < 300)
            setQuestions(
              res.data.filter((x) => x.lesson?._id === selectedLesson)
            );
          return;
        }
        case 1: {
          const res = await SERVICES.GetApprovedQuestionBySolver(getLocalId());
          if (res.status >= 200 && res.status < 300)
            setQuestions(
              res.data.filter((x) => x.lesson?._id === selectedLesson)
            );
          return;
        }
        case 2: {
          const res = await SERVICES.GetRejectedQuestionBySolver(getLocalId());
          if (res.status >= 200 && res.status < 300)
            setQuestions(
              res.data.filter((x) => x.lesson?._id === selectedLesson)
            );
          return;
        }
        default:
          setQuestions([]);
          return;
      }
    } else setQuestions([]);
  };

  const onChangeLesson = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lessonId = e.target.value;
    setSelectedLesson(lessonId);
    if (_.isEmpty(lessonId)) return;
    getQuestions();
  };

  const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = parseInt(e.target.value);
    setSelectedStatus(status);
    if (status <= 0) return;
    getQuestions();
  };

  const lessonSelect = useMemo(() => {
    if (_.isEmpty(lessons)) return <p>{CONSTANTS.Strings.LOADING}</p>;

    return (
      <select
        onChange={onChangeLesson}
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons]);

  const getStatus = (
    isSolved: boolean,
    isControlled: boolean,
    result: string | null
  ) => {
    if (isSolved && isControlled && result === "approved")
      return <span className="badge rounded-pill bg-success">Onaylandı</span>;
    if (isSolved && isControlled && result === "rejected")
      return <span className="badge rounded-pill bg-danger">Reddedildi</span>;
    if (isSolved && !isControlled)
      return (
        <span className="badge rounded-pill bg-secondary">
          Kontrol Bekliyor
        </span>
      );
    if (!isSolved)
      return (
        <span className="badge rounded-pill bg-warning">Çözüm Bekliyor</span>
      );
    return <></>;
  };

  const questionList = useMemo(() => {
    if (_.isEmpty(questions))
      return (
        <tr>
          <td colSpan={8}>
            <p>Soru Bulunamadı.</p>
          </td>
        </tr>
      );

    return questions.map((question) => {
      return (
        <tr key={question._id}>
          <td>{question.lesson?.name}</td>
          <td>
            <img
              src={SERVICES.GetFile(question?.question?._id)}
              style={{ maxHeight: "70px" }}
              onClick={() => setQuestionId(question)}
            />
          </td>
          <td>
            {getStatus(
              question.isSolved,
              question.isControlled,
              question.result
            )}
          </td>
          <td>{SERVICES.GetFullName(question.sentBy)}</td>
          <td>{SERVICES.GetFullName(question.solvedBy)}</td>
          <td>{SERVICES.GetFullName(question.controlledBy)}</td>
          <td>{SERVICES.GetFullName(question.controlledBy)}</td>
          <td></td>
        </tr>
      );
    });
  }, [questions]);

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-sm-12 col-md-4">{lessonSelect}</div>
        <div className="col-sm-12 col-md-8">
          <div className="row">
            <div className="col-10">
              <select
                onChange={onChangeStatus}
                className="form-select form-select-lg mb-3"
                defaultValue={selectedStatus}
              >
                <option value={""}>Durum Seçiniz</option>
                {(checkRoles(CONSTANTS.Roles.ADMIN, CONSTANTS.Roles.CONTROLLER)
                  ? statusListForController
                  : checkRoles(
                      CONSTANTS.Roles.SOLVER,
                      CONSTANTS.Roles.TESTER_SOLVER
                    )
                  ? statusListForSolver
                  : []
                ).map((status, index) => (
                  <option key={index} value={index}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-2 pb-3">
              <button
                onClick={() => getQuestions()}
                className="btn btn-primary w-100 h-100 px-0"
              >
                <CONSTANTS.MdIcons.MdRefresh size={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-sm align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Ders</th>
                <th scope="col">Soru Resmi</th>
                <th scope="col">Durumu</th>
                <th scope="col">Ekleyen</th>
                <th scope="col">Çözen</th>
                <th scope="col">Kontrollör</th>
                <th scope="col">Atayan</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{questionList}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
