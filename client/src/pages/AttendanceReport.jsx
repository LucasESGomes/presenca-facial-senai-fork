import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import useAttendances from "../hooks/useAttendances";

export default function AttendanceReport() {
  const { sessionId } = useParams();
  const { getFullReportBySession, loading, error } = useAttendances();
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      const res = await getFullReportBySession(sessionId);
      if (res?.success) setReport(res.data);
    })();
  }, [sessionId, getFullReportBySession]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Relatório Completo
          </h1>
          <p className="text-gray-600 mt-2">Relatório de presença da sessão</p>
        </div>

        {loading && <div>Carregando relatório...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && report && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4">
              Sessão: {report.session?.name}
            </h2>
            <p className="text-sm text-gray-600">
              Data: {new Date(report.session?.date).toLocaleString()}
            </p>

            <div className="mt-6">
              <h3 className="font-semibold text-lg">Presentes</h3>
              {report.presentes && report.presentes.length > 0 ? (
                <ul className="list-disc pl-6 mt-2">
                  {report.presentes.map((a) => (
                    <li key={a._id}>{a.student?.name || a.student}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">Nenhum presente registrado</div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg">Ausentes</h3>
              {report.ausentes && report.ausentes.length > 0 ? (
                <ul className="list-disc pl-6 mt-2">
                  {report.ausentes.map((s) => (
                    <li key={s._id || s}>{s.name || s}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">Nenhuma ausência registrada</div>
              )}
            </div>

            <div className="mt-6">
              <Link
                to={`/class-sessions/${sessionId}`}
                className="text-red-600"
              >
                Ver sessão
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
