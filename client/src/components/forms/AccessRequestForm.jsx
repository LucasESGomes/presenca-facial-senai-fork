import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { maskCpf } from "../../utils/maskCpf";

export default function AccessRequestForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("professor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name,
        cpf, 
        email,
        password,
        role,
      };

      const res = await onSubmit(payload);

      if (!res?.success) {
        setError(res?.message || "Erro ao enviar solicitação");
      }
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Input
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="CPF"
        value={cpf}
        onChange={(e) => setCpf(maskCpf(e.target.value))}
        placeholder="000.000.000-00"
        maxLength={14}
        required
      />

      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="professor">Professor</option>
          <option value="coordenador">Coordenador</option>
        </select>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full"
      >
        Enviar solicitação
      </Button>
    </form>
  );
}
