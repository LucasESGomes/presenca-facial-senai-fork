import jwt from "jsonwebtoken";
import { ValidationError, UnauthorizedError } from "../errors/appError.js";


class JwtService {
    /**
     * Cria um token JWT
     * @param {Object} payload - Dados a serem incluídos no token
     * @returns {String} Token JWT
     */
    static createToken(payload) {
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        
        if (!JWT_SECRET || !JWT_EXPIRES_IN) {
            console.warn(
                "⚠️  JWT_SECRET ou JWT_EXPIRES_IN não definidos no .env — o sistema pode falhar em autenticações."
            );
        }
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }

    /**
     * Verifica e decodifica um token JWT
     * @param {String} token - Token JWT
     * @returns {Object} Payload decodificado
     */
    static verifyToken(token) {
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.warn("JWT_SECRET não definido no .env");
        }

        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError")
                throw new UnauthorizedError("Token expirado. Faça login novamente.");
            throw new ValidationError("Token inválido ou malformado.");
        }
    }


    /**
     * Extrai token do header Authorization
     * @param {String} authHeader - Header Authorization
     * @returns {String} Token JWT
     */
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ValidationError("Formato do header de autorização inválido.");
        }
        return authHeader.split(" ")[1];
    }
}

export default JwtService;
