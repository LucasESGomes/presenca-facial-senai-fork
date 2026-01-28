import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaUserCheck, FaUserTimes } from "react-icons/fa";
import useAttendances from "../hooks/useAttendances";
import Layout from "../components/layout/Layout";

function AttendancesBySession() {
  const { sessionId } = useParams();
  const [attendances, setAttendances] = useState([]);

  const { loading, error, getBySession, createManual } = useAttendances();

  useEffect(() => {
    if (sessionId) {
      (async () => {
        try {
          const res = await getBySession(sessionId);
          // Response expected to be an array of attendance objects
          const dataArray = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];

          const mapped = dataArray.map((a) => ({
            _id: a._id || a.id,
            student: a.student || (a.studentId ? { _id: a.studentId } : null),
            status: a.status || (a.checkInTime ? "presente" : "ausente"),
            checkInTime: a.checkInTime,
            createdAt: a.createdAt,
            preAttendance: a.preAttendance,
          }));

          setAttendances(mapped);
        } catch (err) {
          console.error("Error loading attendances:", err);
          setAttendances([]);
        }
      })();
    }
  }, [sessionId]);

  const renderStatus = (status) => {
    if (status === "pre_pending") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
          <FaUserTimes />
          Pendente (Reconhecimento)
        </span>
      );
    }
    if (status === "presente") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
          <FaUserCheck />
          Presente
        </span>
      );
    }

    if (status === "atrasado") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
          <FaClock />
          Atrasado
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
        <FaUserTimes />
        Ausente
      </span>
    );
  };

  const confirmPreAttendance = async (attendance) => {
    if (!attendance?.student?._id) return;
    try {
      const res = await createManual({
        classSessionId: sessionId,
        studentId: attendance.student._id,
        status: "presente",
      });
      if (res?.success) {
        // refresh attendances for this session using the session route
        const reportRes = await getBySession(sessionId);
        if (reportRes?.success) {
          const dataArray = Array.isArray(reportRes.data)
            ? reportRes.data
            : Array.isArray(reportRes.data?.data)
              ? reportRes.data.data
              : [];

          const mapped = dataArray.map((a) => ({
            _id: a._id || a.id,
            student: a.student || (a.studentId ? { _id: a.studentId } : null),
            status: a.status || (a.checkInTime ? "presente" : "ausente"),
            checkInTime: a.checkInTime,
            createdAt: a.createdAt,
            preAttendance: a.preAttendance,
          }));

          setAttendances(mapped);
        }
      } else {
        alert(res.message || "Erro ao confirmar presença");
      }
    } catch (err) {
      alert(err.message || "Erro ao confirmar presença");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Presenças da Aula
          </h1>
          <p className="text-gray-600 mt-2">
            Visualização das presenças registradas nesta sessão
          </p>
        </div>

        {loading && (
          <div className="p-6 text-center text-gray-600">
            Carregando presenças...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && attendances.length === 0 && (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p>Nenhuma presença registrada para esta aula.</p>
            <p className="text-sm mt-2">Session ID: {sessionId}</p>
          </div>
        )}

        {!loading && !error && attendances.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-red-600 to-red-700 px-8 py-6">
              <h2 className="text-xl font-bold text-white">
                Lista de Presenças
              </h2>
            </div>

            <div className="divide-y">
              {attendances.map((attendance) => (
                <div
                  key={attendance._id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">Aluno</p>
                    <p className="text-gray-500 text-sm">
                      {attendance.student
                        ? attendance.student.name
                        : "Aluno não identificado"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {renderStatus(attendance.status)}

                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Check-in:</strong>{" "}
                        {attendance.checkInTime
                          ? new Date(attendance.checkInTime).toLocaleString(
                              "pt-BR",
                            )
                          : "—"}
                      </p>
                      <p>
                        <strong>Registrado em:</strong>{" "}
                        {new Date(attendance.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {attendance.preAttendance && (
                      <div>
                        <button
                          onClick={() => confirmPreAttendance(attendance)}
                          className="ml-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Confirmar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AttendancesBySession;
