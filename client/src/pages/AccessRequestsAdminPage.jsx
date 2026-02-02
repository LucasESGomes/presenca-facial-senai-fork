import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import useAccessRequests from "../hooks/useAccessRequests";
import {
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
  FaUserPlus,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaIdCard,
  FaEnvelope,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCog,
} from "react-icons/fa";

import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import useModal from "../hooks/useModal";

export default function AccessRequestsAdminPage() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const showToast = (text, type = "info") => setMessage({ text, type });
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

  const { modalConfig, showModal, hideModal, handleConfirm } = useModal();

  const handleDelete = async (id) => {
    showModal({
      title: "Remover Solicitação",
      message:
        "Tem certeza que deseja remover esta solicitação?\nEsta ação não pode ser desfeita.",
      type: "danger",
      confirmText: "Remover",
      cancelText: "Cancelar",
      onConfirm: async () => {
        await remove(id);
        await getAll();
      },
    });
  };

  const handleCreateUser = async (id) => {
    showModal({
      title: "Criar Usuário",
      message: "Deseja criar um usuário a partir desta solicitação?",
      type: "info",
      confirmText: "Criar Usuário",
      cancelText: "Cancelar",
      onConfirm: async () => {
        const res = await createUserFromRequest(id);
        if (res?.success) {
          showToast("Usuário criado com sucesso!", "success");
          await getAll();
        } else {
          showToast(res.message || "Erro ao criar usuário", "error");
        }
      },
    });
  };

  // Contadores de status
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <FaClock className="mr-1" />,
          label: "Pendente",
        };
      case "approved":
        return {
          color: "bg-green-100 text-green-800",
          icon: <FaCheckCircle className="mr-1" />,
          label: "Aprovado",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <FaTimesCircle className="mr-1" />,
          label: "Rejeitado",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <FaCog className="mr-1" />,
          label: status,
        };
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "professor":
        return "bg-blue-100 text-blue-800";
      case "coordinator":
        return "bg-indigo-100 text-indigo-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaUserClock className="text-red-600 mr-3" />
                Solicitações de Acesso
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie as solicitações de acesso ao sistema
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                {requests.length} total
              </span>
            </div>
          </div>

          {/* Cards de Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <FaClock className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aprovadas</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {approvedCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <FaTimesCircle className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rejeitadas</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {rejectedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaUserClock className="text-red-600 mr-3" />
              Todas as Solicitações
              <span className="ml-3 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {requests.length} registros
              </span>
            </h3>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4">
                  <FaSpinner className="hidden" />
                </div>
                <p className="text-gray-600">Carregando solicitações...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <FaExclamationTriangle className="mr-3 text-red-600" />
                  <div>
                    <p className="font-bold">Erro ao carregar solicitações</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && requests.length === 0 && (
              <div className="text-center py-12">
                <FaUserClock className="text-gray-300 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-gray-500">
                  Não há solicitações de acesso pendentes no momento.
                </p>
              </div>
            )}

            {!loading && !error && requests.length > 0 && (
              <div className="space-y-6">
                {requests.map((r) => {
                  const statusBadge = getStatusBadge(r.status);
                  return (
                    <div
                      key={r._id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Informações da Solicitação */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}
                            >
                              {statusBadge.icon}
                              {statusBadge.label}
                            </span>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(r.role)}`}
                            >
                              <FaUserTag className="mr-1" />
                              {r.role || "Não definido"}
                            </span>
                            <span className="text-sm text-gray-500 font-mono">
                              ID: {r._id.substring(0, 8)}...
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <div className="flex items-center text-gray-700 mb-1">
                                <FaUserCheck className="text-gray-400 mr-2" />
                                <span className="font-semibold">Nome</span>
                              </div>
                              <p className="text-gray-800 ml-7">
                                {r.name || "Não informado"}
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center text-gray-700 mb-1">
                                <FaIdCard className="text-gray-400 mr-2" />
                                <span className="font-semibold">CPF</span>
                              </div>
                              <p className="text-gray-800 ml-7">
                                {r.cpf || "Não informado"}
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center text-gray-700 mb-1">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <span className="font-semibold">E-mail</span>
                              </div>
                              <p className="text-gray-800 ml-7">
                                {r.email || "Não informado"}
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center text-gray-700 mb-1">
                                <FaUserTag className="text-gray-400 mr-2" />
                                <span className="font-semibold">Tipo</span>
                              </div>
                              <p className="text-gray-800 ml-7 capitalize">
                                {r.role || "Não definido"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="lg:w-64 space-y-4">
                          {/* Dropdown de Status */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Alterar Status
                            </label>
                            <div className="relative">
                              <select
                                value={r.status}
                                onChange={(e) =>
                                  handleStatus(r._id, e.target.value)
                                }
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-white appearance-none"
                              >
                                <option value="pending">Pendente</option>
                                <option value="approved">Aprovado</option>
                                <option value="rejected">Rejeitado</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Botões de Ação */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleCreateUser(r._id)}
                              disabled={r.status !== "approved"}
                              className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                                r.status === "approved"
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <FaUserPlus className="mr-2" />
                              Criar Usuário
                            </button>
                            <button
                              onClick={() => handleDelete(r._id)}
                              className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                            >
                              <FaTrash className="mr-2" />
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={handleConfirm}
        showCancel={modalConfig.showCancel}
        showConfirm={modalConfig.showConfirm}
      />
    </Layout>
  );
}
