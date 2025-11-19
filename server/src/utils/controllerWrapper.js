import handleControllerError from "../errors/handleControllerError.js";

/**
 * Wrapper para controllers assíncronos.
 * Ele captura automaticamente qualquer erro e envia para o handler.
 */
export default function controllerWrapper(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            handleControllerError(err, res);
        });
    };
}
