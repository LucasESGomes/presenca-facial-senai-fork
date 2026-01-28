import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaTimes, FaUser, FaCalendarAlt } from "react-icons/fa";
import useAttendances from "../../hooks/useAttendances";
import { AuthContext } from "../../context/AuthContext";
import useClassesSessions from "../../hooks/useClassesSessions";
import useClasses from "../../hooks/useClasses";
import { useStudents } from "../../hooks/useStudents";

export default function AttendanceForm({
  mode: propMode,
  initialData: propData,
  onSubmit: propOnSubmit,
  classSession,
  student,
  preSelectedSession,
  students: propStudents,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const routeId = params.id;

  const mode = propMode || (routeId ? "edit" : "create");

  const { user } = useContext(AuthContext);
  const { sessions, loadByTeacher, loadAll } = useClassesSessions();
  const { classes, loadClasses } = useClasses();
  const { createManual, update } = useAttendances();
  const { students: loadedStudents, loadStudents } = useStudents();

  const [selectedSession, setSelectedSession] = useState(
    classSession || preSelectedSession || null,
  );
  const [selectedStudent, setSelectedStudent] = useState(student || null);

  const [form, setForm] = useState({
    status: "presente",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState({});
  // Manual attendance should be individual by default.
  // Enable bulk mode explicitly if needed in the future.
  const isBulkMode = false;

  useEffect(() => {
    if (propData) {
      setForm({
        status: propData.status || "presente",
      });
    }
  }, [propData]);

  useEffect(() => {
    if (mode === "create") {
      // ensure students are loaded if parent didn't pass them
      if (!Array.isArray(propStudents) || propStudents.length === 0) {
        loadStudents();
      }
      // ensure classes loaded to map class id -> code
      loadClasses();
      if (user?.role === "professor") {
        loadByTeacher(user.id);
      } else {
        loadAll();
      }
    }
  }, [mode, user, loadByTeacher, loadAll]);

  // initialize statuses when filteredStudents change (bulk mode)
  useEffect(() => {
    // this effect moved below (after filteredStudents is defined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (
        isBulkMode &&
        Array.isArray(propStudents) &&
        propStudents.length > 0
      ) {
        // Bulk mode (disabled by default): create attendance for each student in list
        if (!selectedSession?._id) {
          setError("Sessão não selecionada");
          setSubmitting(false);
          return;
        }

        const entries = Object.entries(studentStatuses || {});
        if (!entries.length) {
          setError("Nenhum aluno selecionado");
          setSubmitting(false);
          return;
        }

        const promises = entries.map(async ([studentId, status]) => {
          return createManual({
            classSessionId: selectedSession._id,
            studentId,
            status,
          });
        });

        const results = await Promise.allSettled(promises);
        const failures = results.filter(
          (r) => r.status === "rejected" || r.value?.success === false,
        );

        if (failures.length === 0) {
          setSuccess(true);
          setTimeout(() => navigate(-1), 1200);
        } else {
          setError("Algumas presenças não puderam ser registradas.");
        }
      } else {
        const sessionToUse = mode === "create" ? selectedSession : classSession;
        const studentToUse = mode === "create" ? selectedStudent : student;

        if (!sessionToUse?._id || !studentToUse?._id) {
          setError("Sessão ou aluno não identificado");
          setSubmitting(false);
          return;
        }

        const payload = {
          classSessionId: sessionToUse._id,
          studentId: studentToUse._id,
          status: form.status,
        };

        const res =
          propOnSubmit ??
          (mode === "edit"
            ? await update(routeId, payload)
            : await createManual(payload));

        if (res?.success !== false) {
          setSuccess(true);
          // For manual single registrations, remain on page so teacher can register more students
          if (mode === "create" && !isBulkMode) {
            setSelectedStudent(null);
            setForm({ status: "presente" });
          } else {
            setTimeout(() => navigate(-1), 1200);
          }
        } else {
          setError(res.message || "Erro ao salvar presença");
        }
      }
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const availableStudents = Array.isArray(propStudents)
    ? propStudents
    : Array.isArray(loadedStudents)
      ? loadedStudents
      : [];

  const filteredStudents = availableStudents.filter((s) => {
    if (!selectedSession) return false;

    const sessionClass = selectedSession.class;
    // gather possible identifiers (code or id)
    const identifiers = [];
    // helper to push class code when available
    const pushClassCode = (cls) => {
      if (!cls) return;
      if (cls.code) identifiers.push(cls.code.toString());
    };
    if (!sessionClass) {
      // nothing to match
    } else if (typeof sessionClass === "string") {
      identifiers.push(sessionClass.toString());
      // also try to find class object by id and push its code
      const found = classes.find(
        (c) => (c._id || c.id) === sessionClass.toString(),
      );
      pushClassCode(found);
    } else {
      if (sessionClass.code) identifiers.push(sessionClass.code.toString());
      if (sessionClass._id) identifiers.push(sessionClass._id.toString());
      if (sessionClass.id) identifiers.push(sessionClass.id.toString());
      // if we have an object without code, try to lookup in classes
      if (!sessionClass.code) {
        const found = classes.find(
          (c) => (c._id || c.id) === (sessionClass._id || sessionClass.id),
        );
        pushClassCode(found);
      }
    }

    if (!Array.isArray(s.classes) || identifiers.length === 0) return false;

    return s.classes.some((c) => identifiers.includes((c || "").toString()));
  });

  // initialize statuses when filteredStudents change (bulk mode)
  // Depend on length and selectedSession id to avoid effect running every render
  useEffect(() => {
    if (isBulkMode && Array.isArray(propStudents) && propStudents.length > 0) {
      const map = {};
      filteredStudents.forEach((s) => {
        map[s._id] = studentStatuses[s._id] || "presente";
      });
      setStudentStatuses((prev) => ({ ...map, ...prev }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredStudents.length, selectedSession?._id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registrar Presença</h1>
        <p className="text-gray-600 mt-2">Sessão de aula e status do aluno</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <FaCheck size={20} />
          Presença registrada com sucesso!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <FaTimes size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Dados da Presença</h2>
          </div>

          <div className="p-8 space-y-6">
            {mode === "edit" && (
              <>
                {/* Aluno */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <FaUser className="text-red-600" />
                  <span className="font-semibold">{student?.name}</span>
                </div>

                {/* Sessão */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <FaCalendarAlt className="text-red-600" />
                  <span>
                    {new Date(classSession?.date).toLocaleString("pt-BR")}
                  </span>
                </div>
              </>
            )}

            {mode === "create" && !preSelectedSession && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Sessão de Aula
                  </label>
                  <select
                    value={selectedSession?._id || ""}
                    onChange={(e) => {
                      const sess = sessions.find(
                        (s) => s._id === e.target.value,
                      );
                      setSelectedSession(sess);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  >
                    <option value="">Selecione uma sessão</option>
                    {sessions.map((sess) => (
                      <option key={sess._id} value={sess._id}>
                        {sess.name} - {new Date(sess.date).toLocaleDateString()}{" "}
                        - {sess.class?.code}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {mode === "create" && (
              <>
                {isBulkMode &&
                Array.isArray(propStudents) &&
                propStudents.length > 0 ? (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Alunos da Turma
                    </label>
                    <div className="max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                      {filteredStudents.map((stud) => (
                        <div
                          key={stud._id}
                          className="flex items-center justify-between gap-4 p-2 bg-white rounded mb-2"
                        >
                          <div>
                            <div className="font-medium">{stud.name}</div>
                            <div className="text-sm text-gray-500">
                              {stud.registration}
                            </div>
                          </div>
                          <div>
                            <select
                              value={studentStatuses[stud._id] || "presente"}
                              onChange={(e) =>
                                setStudentStatuses((p) => ({
                                  ...p,
                                  [stud._id]: e.target.value,
                                }))
                              }
                              className="px-3 py-2 border rounded"
                            >
                              <option value="presente">Presente</option>
                              <option value="atrasado">Atrasado</option>
                              <option value="ausente">Ausente</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Aluno
                    </label>
                    <select
                      value={selectedStudent?._id || ""}
                      onChange={(e) => {
                        const stud = filteredStudents.find(
                          (s) => s._id === e.target.value,
                        );
                        setSelectedStudent(stud);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    >
                      <option value="">Selecione um aluno</option>
                      {filteredStudents.map((stud) => (
                        <option key={stud._id} value={stud._id}>
                          {stud.name} - {stud.registration}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Status da Presença
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >
                <option value="presente">Presente</option>
                <option value="atrasado">Atrasado</option>
                <option value="ausente">Ausente</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? "Salvando..." : "Registrar Presença"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
