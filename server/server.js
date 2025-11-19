import dotenv from "dotenv";
import app from "./src/app.js";

// Carregar variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}  (${process.env.NODE_ENV || "development"}) \n👨‍⚕️Health check disponível em: http://localhost:5000/api/health`);
});
