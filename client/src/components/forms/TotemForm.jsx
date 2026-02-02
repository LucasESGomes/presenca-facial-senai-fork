import { useEffect, useState } from "react";
import { useTotems } from "../../hooks/useTotems";
import useModal from "../../hooks/useModal";
import Modal from "../ui/Modal";
import { useRooms } from "../../hooks/useRooms";
import {
  FaQrcode,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function TotemForm({
  mode = "create",
  initialData = {},
  onSubmit,
}) {
  const { createTotem, updateTotem } = useTotems();
  const { rooms, loadRooms } = useRooms();

  const [form, setForm] = useState({
    name: "",
    location: "",
    room: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const { modalConfig, showModal, hideModal, handleConfirm } = useModal();

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm((f) => ({
        ...f,
        name: initialData.name || "",
        location: initialData.location || "",
        room: initialData.room?._id || initialData.room || "",
        isActive:
          typeof initialData.isActive === "boolean"
            ? initialData.isActive
            : true,
      }));
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
    try {
      if (mode === "edit") {
        const id = initialData.id || initialData._id;
        const res = onSubmit
          ? await onSubmit(form)
          : await updateTotem(id, form);
        if (res?.success === false)
          throw new Error(res.message || "Erro ao atualizar totem");
        showModal({
          title: "Totem atualizado",
          message: "Totem atualizado",
          type: "success",
          showCancel: false,
          confirmText: "OK",
        });
      } else {
        const res = onSubmit ? await onSubmit(form) : await createTotem(form);
        if (res?.success === false)
          throw new Error(res.message || "Erro ao criar totem");
        showModal({
          title: "Totem criado",
          message: "Totem criado",
          type: "success",
          showCancel: false,
          confirmText: "OK",
        });
        setForm({ name: "", location: "", room: "", isActive: true });
      }
    } catch (err) {
      showModal({
        title: "Erro",
        message: err.message || "Erro ao salvar",
        type: "danger",
        showCancel: false,
        confirmText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Cabeçalho do Formulário */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
          <div className="flex items-center">
            <div className="bg-white/20 p-2.5 rounded-lg mr-4">
              <FaQrcode className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === "edit" ? "Editar Totem" : "Novo Totem"}
              </h2>
              <p className="text-red-100 text-sm mt-1">
                {mode === "edit"
                  ? "Atualize os dados do totem"
                  : "Configure um novo totem de presença"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaQrcode className="text-red-600 mr-2" />
                  Nome do Totem *
                </div>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Totem Recepção, Totem Laboratório"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaMapMarkerAlt className="text-red-600 mr-2" />
                  Localização *
                </div>
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Ex: Entrada principal, Corredor A, Sala de professores"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>

            {/* Sala */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center text-gray-700 font-medium">
                  <FaDoorOpen className="text-red-600 mr-2" />
                  Sala Vinculada *
                </div>
              </label>
              <select
                name="room"
                value={form.room}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
              >
                <option value="">Selecione uma sala</option>
                {rooms?.map((r) => (
                  <option key={r.id || r._id} value={r.id || r._id}>
                    {r.name} - {r.code || "Sem código"}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Ativo */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                {form.isActive ? (
                  <div className="flex items-center text-green-600">
                    <FaToggleOn className="text-2xl mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">
                        Totem Ativo
                      </span>
                      <p className="text-sm text-gray-500">
                        Aceitando leituras de presença
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <FaToggleOff className="text-2xl mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">
                        Totem Inativo
                      </span>
                      <p className="text-sm text-gray-500">
                        Não está funcionando
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`block w-14 h-7 rounded-full transition-colors ${
                      form.isActive ? "bg-green-600" : "bg-gray-400"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                      form.isActive ? "transform translate-x-7" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Indicadores Visuais */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center">
                {form.isActive ? (
                  <>
                    <FaCheckCircle className="text-green-600 mr-2" />
                    <span className="text-sm text-green-700 font-medium">
                      Status: Ativo
                    </span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600 font-medium">
                      Status: Inativo
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {form.room ? (
                  <span className="font-medium">Sala vinculada ✓</span>
                ) : (
                  <span className="text-gray-500">
                    Nenhuma sala selecionada
                  </span>
                )}
              </div>
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
                      Criar Totem
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
              Após criar o totem, gere uma API Key para começar a usar o
              reconhecimento facial.
            </p>
          </div>
        </form>
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
    </div>
  );
}
