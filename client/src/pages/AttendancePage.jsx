import { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaPlus } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import AttendanceForm from "../components/forms/AttendanceForm";
import { AuthContext } from "../context/AuthContext";
import useClasses from "../hooks/useClasses";
import useClassesSessions from "../hooks/useClassesSessions";
import { useStudents } from "../hooks/useStudents";

export default function AttendancePage() {
  const { user } = useContext(AuthContext);
  const { classes, loadClasses, loadMyClasses } = useClasses();
  const { sessions, loadByClass } = useClassesSessions();
  const { students, loadStudents } = useStudents();

  const [step, setStep] = useState("classes");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadStudents();
    if (user?.role === "professor") {
      loadMyClasses();
    } else {
      loadClasses();
    }
  }, [user, loadStudents, loadClasses, loadMyClasses]);

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setStep("sessions");
    loadByClass(cls._id);
  };

  const handleSessionClick = (sess) => {
    setSelectedSession(sess);
    setStep("create");
  };

  const handleBack = () => {
    if (step === "create") {
      setStep("sessions");
      setSelectedSession(null);
    } else if (step === "sessions") {
      setStep("classes");
      setSelectedClass(null);
    }
  };

  const renderClasses = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Selecione uma Turma</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={cls._id}
            onClick={() => handleClassClick(cls)}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-red-600" />
              <h3 className="text-lg font-semibold">{cls.code}</h3>
            </div>
            <p className="text-gray-600">{cls.course}</p>
            <p className="text-sm text-gray-500">
              {cls.shift} - {cls.year}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          <FaArrowLeft /> Voltar
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Sessões de {selectedClass?.code}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((sess) => (
          <div
            key={sess._id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className="text-red-600" />
              <h3 className="text-lg font-semibold">{sess.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {new Date(sess.date).toLocaleDateString("pt-BR")}
            </p>
            <button
              onClick={() => handleSessionClick(sess)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FaPlus /> Marcar Presença
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          <FaArrowLeft /> Voltar
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Marcar Presença - {selectedSession?.name}
        </h2>
      </div>
      <AttendanceForm
        mode="create"
        preSelectedSession={selectedSession}
        students={students}
      />
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {step === "classes" && renderClasses()}
        {step === "sessions" && renderSessions()}
        {step === "create" && renderCreate()}
      </div>
    </Layout>
  );
}
