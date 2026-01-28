import { useEffect, useState } from "react";
import useClassesSessions from "../../hooks/useClassesSessions";
import { useUsers } from "../../hooks/useUsers";
import { useRooms } from "../../hooks/useRooms";
import useClasses from "../../hooks/useClasses";
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

  const [form, setForm] = useState({
    name: "",
    date: "",
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
        date: initialData.date ? initialData.date.substring(0, 16) : "",
        room: initialData.room || "",
        notes: initialData.notes || "",
        teacher: initialData.teacher || "",
      });
    }
  }, [mode, initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    // 🔹 Payload no formato do backend
    const payload = {
      name: form.name,
      date: new Date(form.date).toISOString(),
      notes: form.notes,
      classId: form.classId,
      room: form.room,
      teacher: form.teacher,
      status: form.isClosed ? "closed" : "active",
    };

    try {
      let res;
      if (mode === "edit") {
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

      alert(mode === "edit" ? "Sessão atualizada" : "Sessão criada");
    } catch (err) {
      alert(err.message || "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
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

            {/* DATA */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaCalendarAlt className="text-red-600 mr-2" />
                  Data e Hora *
                </div>
              </label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
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
              >
                <option value="">Selecione a turma</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.code} - {cls.name || "Sem nome"}
                  </option>
                ))}
              </select>
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
                    className={`block w-12 h-6 rounded-full transition-colors ${
                      form.isClosed ? "bg-red-600" : "bg-green-600"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      form.isClosed ? "transform translate-x-6" : ""
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
                      Criar Sessão
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
    </div>
  );
}
