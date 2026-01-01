import { useState, useCallback } from 'react';
import { studentsApi } from '../api/students';

export function useStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carregar todos os alunos
    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsApi.getAll();

            if (response.success) {
                setStudents(response.data || []);
            } else {
                setError(response.message || 'Erro ao carregar alunos');
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar alunos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar alunos por turma
    const loadStudentsByClass = useCallback(async (classCode) => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsApi.getByClass(classCode);

            if (response.success) {
                setStudents(response.data || []);
            } else {
                setError(response.message || 'Erro ao carregar alunos');
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar alunos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Criar novo aluno
    const createStudent = useCallback(async (studentData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsApi.create(studentData);

            if (response.success) {
                setStudents(prev => [response.data, ...prev]);
                return { success: true, data: response.data };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const message = err.message || 'Erro ao criar aluno';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Atualizar aluno
    const updateStudent = useCallback(async (id, studentData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsApi.update(id, studentData);

            if (response.success) {
                setStudents(prev =>
                    prev.map(student =>
                        student._id === id ? response.data : student
                    )
                );
                return { success: true, data: response.data };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const message = err.message || 'Erro ao atualizar aluno';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Excluir aluno
    const deleteStudent = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsApi.delete(id);

            if (response.success) {
                setStudents(prev => prev.filter(student => student._id !== id));
                return { success: true };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const message = err.message || 'Erro ao excluir aluno';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Processar imagem facial
    const encodeFace = useCallback(async (imageFile) => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentsApi.encodeFace(imageFile);
            return { success: true, data: data.embedding };
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao processar imagem facial';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Validar imagem
    const validateImage = useCallback((file) => {
        return studentsApi.validateImage(file);
    }, []);

    // Filtrar alunos
    const filterStudents = useCallback((studentsList, filters = {}) => {
        let filtered = [...studentsList];

        const { classCode, searchTerm, isActive } = filters;

        if (classCode && classCode !== 'all') {
            filtered = filtered.filter(student =>
                student.classes?.includes(classCode)
            );
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(term) ||
                student.registration.toLowerCase().includes(term)
            );
        }

        if (isActive !== undefined) {
            filtered = filtered.filter(student =>
                student.isActive === isActive
            );
        }

        return filtered;
    }, []);

    return {
        // Estado
        students,
        loading,
        error,

        // Ações
        loadStudents,
        loadStudentsByClass,
        createStudent,
        updateStudent,
        deleteStudent,
        encodeFace,
        validateImage,
        filterStudents,

        // Utilitários
        clearError: () => setError(null),
        setStudents,
    };
}