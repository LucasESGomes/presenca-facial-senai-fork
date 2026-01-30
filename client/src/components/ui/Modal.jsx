import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    showCancel = true,
    showConfirm = true
}) {
    // Fechar modal com ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevenir scroll do body quando modal está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const typeConfig = {
        info: {
            icon: <FiInfo className="text-blue-500" size={24} />,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            textColor: "text-blue-700"
        },
        warning: {
            icon: <FiAlertCircle className="text-yellow-500" size={24} />,
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            textColor: "text-yellow-700"
        },
        danger: {
            icon: <FiAlertCircle className="text-red-500" size={24} />,
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            textColor: "text-red-700"
        },
        success: {
            icon: <FiCheckCircle className="text-green-500" size={24} />,
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            textColor: "text-green-700"
        }
    };

    const config = typeConfig[type] || typeConfig.info;

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={handleOverlayClick}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`${config.bgColor} ${config.borderColor} rounded-xl shadow-2xl w-full max-w-md overflow-hidden`}
                        >
                            {/* Header */}
                            <div className="p-6 ">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {config.icon}
                                        <h3 className={`text-lg font-semibold ${config.textColor}`}>
                                            {title}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <p className="text-gray-700 whitespace-pre-line">{message}</p>
                            </div>

                            {/* Footer */}
                            <div className={`p-6 ${config.bgColor} ${config.borderColor}`}>
                                <div className="flex justify-end space-x-3">
                                    {showCancel && (
                                        <button
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                        >
                                            {cancelText}
                                        </button>
                                    )}
                                    {showConfirm && (
                                        <button
                                            onClick={handleConfirm}
                                            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${type === "danger"
                                                    ? "bg-red-600 hover:bg-red-700"
                                                    : type === "warning"
                                                        ? "bg-yellow-600 hover:bg-yellow-700"
                                                        : type === "success"
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            {confirmText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}