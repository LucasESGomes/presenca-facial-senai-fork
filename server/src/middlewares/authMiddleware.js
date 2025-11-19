import { decode } from "jsonwebtoken";
import JwtService from "../services/JwtService.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Middleware de autenticação JWT com controle de roles
 *
 * Pode ser usado de duas formas:
 *   1. Apenas autenticar: authenticateJWT()
 *   2. Autenticar + verificar roles: authenticateJWT("coordenador"), authenticateJWT("admin", "professor")
 *
 * Exemplo de uso:
 *   router.get("/painel", authenticateJWT("coordenador"), controller.index);
 */
export const authenticateJWT = (...requiredRoles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = JwtService.extractTokenFromHeader(authHeader);

            // Verifica e decodifica o token
            const decoded = JwtService.verifyToken(token);
            req.user = decoded; // Exemplo: { id, nome, email, role }

            
            // Se roles foram passadas, valida se o usuário tem permissão
            if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
                return ApiResponse.FORBIDDEN(res, "Você não tem permissão para acessar este recurso." )
            }
            
            next();
        } catch (error) {
            if (error.name === "ValidationError") {
                return ApiResponse.BADREQUEST(res, "Formato de autorização inválido.")
            }

            return ApiResponse.FORBIDDEN(res, "Você não tem permissão para acessar este recurso.")
        }
    };
};
