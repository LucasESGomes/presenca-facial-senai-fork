import { useState, useCallback } from "react";

export default function useModal() {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        showCancel: true,
        showConfirm: true
    });

    const showModal = useCallback(({
        title,
        message,
        type = "info",
        onConfirm,
        confirmText = "Confirmar",
        cancelText = "Cancelar",
        showCancel = true,
        showConfirm = true
    }) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            confirmText,
            cancelText,
            showCancel,
            showConfirm
        });
    }, []);

    const hideModal = useCallback(() => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleConfirm = useCallback(() => {
        if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
        }
        hideModal();
    }, [modalConfig, hideModal]);

    return {
        modalConfig,
        showModal,
        hideModal,
        handleConfirm
    };
}