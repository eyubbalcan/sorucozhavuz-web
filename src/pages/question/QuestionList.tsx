import "./Question.scss";
import React, { useEffect, useMemo, useState } from "react";
import * as SERVICES from "../../services";
import * as CONSTANTS from "../../constants";
import { ILessonRes, IQuestionRes } from "../../models";
import _ from "lodash";

const QuestionList: React.FC = () => {
  const [lessons, setLessons] = useState<ILessonRes[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [questions, setQuestions] = useState<IQuestionRes[]>([]);

  useEffect(() => {
    SERVICES.GetLessons().then((res) => {
      setLessons(res.data);
    });

    return () => {
      setLessons([]);
      setSelectedLesson("");
      setQuestions([]);
    };
  }, []);

  const onChangeLesson = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lessonId = e.target.value;
    setSelectedLesson(lessonId);
    if (_.isEmpty(lessonId)) return;
    SERVICES.GetQuestions(lessonId).then((res) => {
      setQuestions(res.data);
    });
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

  const getStatus = (isSolved: boolean, isControlled: boolean) => {
    if (isSolved && isControlled)
      return <span className="badge rounded-pill bg-success">Onaylandı</span>;
    if (isSolved && !isControlled)
      return (
        <span className="badge rounded-pill bg-secondary">
          Kontrol Bekliyor
        </span>
      );
    if (!isSolved)
      return (
        <span className="badge rounded-pill bg-warning">
          Çözülmesi Bekleniyor
        </span>
      );
    return <></>;
  };

  const questionList = useMemo(() => {
    if (_.isEmpty(questions)) return <p>Soru Bulunamadı.</p>;

    return questions.map((question) => {
      return (
        <tr key={question._id}>
          <td>{question.lesson?.name}</td>
          <td>
            <a
              className="fw-bold"
              target="_blank"
              href={SERVICES.GetFile(question?.question?._id)}
            >
              Soruyu Gör
            </a>
          </td>
          <td>{getStatus(question.isSolved, question.isControlled)}</td>
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
        <div className="col-sm-12 col-md-6">{lessonSelect}</div>
      </div>
      <div className="row">
        <table className="table table-responsive table-bordered table-striped table-sm align-middle ">
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
  );
};

export default QuestionList;
