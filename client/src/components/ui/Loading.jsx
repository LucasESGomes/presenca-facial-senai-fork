import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Loading({
    message,
    messages = [],
    delayBetweenMessages = 3000,
    showProgress = false
}) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (messages.length > 1) {
            const interval = setInterval(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
            }, delayBetweenMessages);

            return () => clearInterval(interval);
        }
    }, [messages, delayBetweenMessages]);

    const currentMessage =
        message ||
        (messages.length > 0 ? messages[currentMessageIndex] : "Carregando...");

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">

                {/* Spinner */}
                <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-600" />
                </div>

                {/* Mensagem */}
                <motion.div
                    key={currentMessage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                >
                    <h2 className="text-lg font-medium text-gray-700">
                        {currentMessage}
                    </h2>
                </motion.div>

                {/* Indicador de progresso */}
                {messages.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                        {messages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-1.5 h-1.5 rounded-full ${index === currentMessageIndex
                                        ? "bg-red-600"
                                        : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
