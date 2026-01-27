import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import useAccessRequests from "../hooks/useAccessRequests";

export default function AccessRequestsAdminPage() {
  const {
    requests,
    getAll,
    loading,
    error,
    updateStatus,
    remove,
    createUserFromRequest,
  } = useAccessRequests();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const handleStatus = async (id, status) => {
    await updateStatus(id, status);
    await getAll();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remover solicitação?")) return;
    await remove(id);
    await getAll();
  };

  const handleCreateUser = async (id) => {
    const res = await createUserFromRequest(id);
    if (res?.success) {
      alert("Usuário criado com sucesso");
      await getAll();
    } else alert(res.message || "Erro ao criar usuário");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Solicitações de Acesso</h1>
        {loading && <div>Carregando...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r._id}
              className="p-4 bg-white border rounded flex justify-between items-center"
            >
              <div>
                <div>
                  <strong>ID:</strong> {r._id}
                </div>
                <div>
                  <strong>Nome:</strong> {r.name}
                </div>
                <div>
                  <strong>CPF:</strong> {r.cpf}
                </div>
                <div>
                  <strong>Email:</strong> {r.email}
                </div>
                <div>
                  <strong>Role:</strong> {r.role}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  defaultValue={r.status}
                  onChange={(e) => handleStatus(r._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateUser(r._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Criar Usuário
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
