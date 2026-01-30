import { useEffect, useState } from "react";
import useClassesSessions from "../../hooks/useClassesSessions";
import { useUsers } from "../../hooks/useUsers";
import { useRooms } from "../../hooks/useRooms";
import useAttendances from "../../hooks/useAttendances";
import useClasses from "../../hooks/useClasses";
import Toast from "../ui/Toast";
import Modal from "../ui/Modal"; // Importar o Modal
import useModal from "../../hooks/useModal"; // Importar o hook useModal

import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaUsers,
  FaStickyNote,
  FaLock,
  FaLockOpen,
  FaSave,
  FaPlus,
  FaBook,
} from "react-icons/fa";
import { Navigate } from "react-router-dom";


export default function ClassSessionForm({
  mode = "create",
  initialData = {},
  onSubmit,
  classId: fixedClassId,
}) {
  const { createSession, updateSession } = useClassesSessions();
  const { teachers, loadUsers } = useUsers();
  const { rooms, loadRooms } = useRooms();
  const { classes, loadClasses } = useClasses();
  const { getFullReportBySession } = useAttendances();

  // Estado do Toast
  const [message, setMessage] = useState({ text: "", type: "" });

  // Usar hook do Modal
  const { modalConfig, showModal, hideModal, handleConfirm } = useModal();

  const [form, setForm] = useState({
    name: "",
    notes: "",
    classId: fixedClassId || "",
    room: "",
    teacher: "",
    isClosed: false,
  });

  const [submitting, setSubmitting] = useState(false);

  // 🔹 Carregar dados auxiliares
  useEffect(() => {
    loadUsers();
    loadRooms();
    loadClasses();
  }, [loadUsers, loadRooms, loadClasses]);

  // 🔹 Preencher no EDIT
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        classId: initialData.classId || "",
        room: initialData.room || "",
        notes: initialData.notes || "",
        teacher: initialData.teacher || "",
        isClosed: initialData.status === "closed" || initialData.isClosed || false,
      });
    }
  }, [mode, initialData]);

  // Função para mostrar Toast
  const showToast = (text, type = "info") => {
    setMessage({ text, type });
  };

  // Função para mostrar modal de confirmação antes de salvar
  const showSaveConfirmation = (payload, isEdit) => {
    showModal({
      title: isEdit ? "Salvar Alterações" : "Criar Sessão",
      message: isEdit
        ? "Deseja salvar as alterações nesta sessão?"
        : "Deseja criar esta nova sessão de aula?",
      type: "info",
      confirmText: isEdit ? "Salvar" : "Criar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        await performSubmit(payload, isEdit);
      }
    });
  };

  // Função que realiza o submit após confirmação
  const performSubmit = async (payload, isEdit) => {
    setSubmitting(true);

    try {
      let res;
      if (isEdit) {
        const id = initialData._id || initialData.id;
        res = onSubmit
          ? await onSubmit(payload)
          : await updateSession(id, payload);
      } else {
        res = onSubmit ? await onSubmit(payload) : await createSession(payload);
      }

      if (!res?.success) {
        throw new Error(res?.message || "Erro ao salvar sessão");
      }

      // Mostrar toast de sucesso
      showToast(
        isEdit ? "Sessão atualizada com sucesso!" : "Sessão criada com sucesso!",
        "success"
      );  

      // Navegar para página de relatório completo após criação

      window.location.href = `/class-sessions/${res.data._id}`;

      // Limpar formulário se for criação
      if (!isEdit && !onSubmit) {
        setForm({
          name: "",
          notes: "",
          classId: fixedClassId || "",
          room: "",
          teacher: "",
          isClosed: false,
        });
      }

    } catch (err) {
      showToast(err.message || "Erro ao salvar a sessão", "error");
    } finally {
      setSubmitting(false);
    }
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validar campos obrigatórios
    if (!form.name.trim()) {
      showToast("O título da aula é obrigatório", "warning");
      return;
    }

    if (!form.classId) {
      showToast("Selecione uma turma", "warning");
      return;
    }

    if (!form.room) {
      showToast("Selecione uma sala", "warning");
      return;
    }

    if (!form.teacher) {
      showToast("Selecione um professor", "warning");
      return;
    }

    // 🔹 Payload no formato do backend
    const payload = {
      name: form.name,
      notes: form.notes,
      classId: form.classId,
      room: form.room,
      teacher: form.teacher,
      status: form.isClosed ? "closed" : "active",
    };

    // Mostrar modal de confirmação antes de salvar
    showSaveConfirmation(payload, mode === "edit");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Cabeçalho do Formulário */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
          <div className="flex items-center">
            <div className="bg-white/20 p-2.5 rounded-lg mr-4">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === "edit" ? "Editar Sessão" : "Nova Sessão de Aula"}
              </h2>
              <p className="text-red-100 text-sm mt-1">
                {mode === "edit"
                  ? "Atualize os dados da sessão"
                  : "Preencha os campos para criar uma nova sessão"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* TÍTULO */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaBook className="text-red-600 mr-2" />
                  Título da Aula *
                </div>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Aula de Programação Web"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>

            {/* TURMA */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaUsers className="text-red-600 mr-2" />
                  Turma *
                </div>
              </label>
              <select
                name="classId"
                value={form.classId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                disabled={!!fixedClassId}
              >
                <option value="">Selecione a turma</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.code} - {cls.name || "Sem nome"}
                  </option>
                ))}
              </select>
              {fixedClassId && (
                <p className="text-sm text-gray-500 mt-1">
                  Turma fixada pelo contexto da página
                </p>
              )}
            </div>

            {/* SALA */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaDoorOpen className="text-red-600 mr-2" />
                  Sala *
                </div>
              </label>
              <select
                name="room"
                value={form.room}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
              >
                <option value="">Selecione a sala</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name} - {room.location || "Sem localização"}
                  </option>
                ))}
              </select>
            </div>

            {/* PROFESSOR */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaChalkboardTeacher className="text-red-600 mr-2" />
                  Professor *
                </div>
              </label>
              <select
                name="teacher"
                value={form.teacher}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
              >
                <option value="">Selecione o professor</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} - {t.email || "Sem e-mail"}
                  </option>
                ))}
              </select>
            </div>

            {/* NOTAS */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaStickyNote className="text-red-600 mr-2" />
                  Observações
                </div>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Ex: Conteúdo abordado, materiais necessários, etc."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              />
            </div>

            {/* FECHADA */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                {form.isClosed ? (
                  <FaLock className="text-red-600 mr-3" />
                ) : (
                  <FaLockOpen className="text-green-600 mr-3" />
                )}
                <div>
                  <span className="font-medium text-gray-700">
                    Status da Sessão
                  </span>
                  <p className="text-sm text-gray-500">
                    {form.isClosed ? "Encerrada" : "Aberta para presenças"}
                  </p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isClosed"
                    checked={form.isClosed}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`block w-12 h-6 rounded-full transition-colors ${form.isClosed ? "bg-red-600" : "bg-green-600"
                      }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.isClosed ? "transform translate-x-6" : ""
                      }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {mode === "edit" ? "Salvando..." : "Criando..."}
                </>
              ) : (
                <>
                  {mode === "edit" ? (
                    <>
                      <FaSave className="mr-2" />
                      Salvar Alterações
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" />
                      Criar aula
                    </>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Informações */}
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">
                Campos marcados com * são obrigatórios.
              </span>{" "}
              Após criar a sessão, você poderá registrar as presenças dos
              alunos.
            </p>
          </div>
        </form>
      </div>

      {/* Toast */}
      <Toast
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />

      {/* Modal */}
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
    </div>
  );
}