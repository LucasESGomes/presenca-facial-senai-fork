import { useState, useCallback } from 'react';
import { classesApi } from '../api/classes';

export function useClasses() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadClasses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await classesApi.getAll();

            if (response.success) {
                setClasses(response.data || []);
            } else {
                setError(response.message || 'Erro ao carregar turmas');
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar turmas');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMyClasses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await classesApi.getMyClasses();

            if (response.success) {
                setClasses(response.data || []);
            } else {
                setError(response.message || 'Erro ao carregar turmas');
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar turmas');
        } finally {
            setLoading(false);
        }
    }, []);

    const createClass = useCallback(async (classData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await classesApi.create(classData);

            if (response.success) {
                setClasses(prev => [response.data, ...prev]);
                return { success: true, data: response.data };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const message = err.message || 'Erro ao criar turma';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        // Estado
        classes,
        loading,
        error,

        // Ações
        loadClasses,
        loadMyClasses,
        createClass,

        // Utilitários
        clearError: () => setError(null),
    };
}