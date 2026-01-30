import { useState, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaPlusCircle, FaTimes } from "react-icons/fa";

export default function StudentClassesSelect({
    value = [],
    onChange,
    classes = [],
    maxSelection = 5,
}) {
    const [selectedClasses, setSelectedClasses] = useState(value);
    const [showAll, setShowAll] = useState(false);

    // Inicializar com o value passado
    useEffect(() => {
        setSelectedClasses(value);
    }, [value]);

    const handleClassToggle = (classCode) => {
        const newSelection = selectedClasses.includes(classCode)
            ? selectedClasses.filter(code => code !== classCode)
            : [...selectedClasses, classCode];

        // Limitar seleção máxima
        if (newSelection.length > maxSelection) {
            return;
        }

        setSelectedClasses(newSelection);
        onChange(newSelection);
    };

    const handleRemoveClass = (classCode, e) => {
        e.stopPropagation();
        const newSelection = selectedClasses.filter(code => code !== classCode);
        setSelectedClasses(newSelection);
        onChange(newSelection);
    };

    const handleClearAll = () => {
        setSelectedClasses([]);
        onChange([]);
    };

    const getClassByCode = (code) => {
        return classes.find(c => c.code === code);
    };

    // Filtrar classes visíveis
    const visibleClasses = showAll ? classes : classes.slice(0, 8);
    const hasMoreClasses = classes.length > 8;

    // Estatísticas
    const selectedCount = selectedClasses.length;
    const remainingSelections = maxSelection - selectedCount;

    return (
        <div className="space-y-4">
            {/* Cabeçalho com contador */}
            <div className="flex items-center justify-between">
                {selectedCount > 0 && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                    >
                        <FaTimes className="text-xs" />
                        <span>Limpar seleção</span>
                    </button>
                )}
            </div>

            {/* Contador de seleção */}
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {selectedCount} selecionada(s)
                        </div>
                        {remainingSelections > 0 ? (
                            <span className="text-sm text-gray-600">
                                {remainingSelections} seleção(ões) restante(s)
                            </span>
                        ) : (
                            <span className="text-sm text-red-600 font-medium">
                                Limite máximo atingido
                            </span>
                        )}
                    </div>

                    {selectedCount > 0 && (
                        <div className="text-xs text-gray-500">
                            Clique em uma turma selecionada para remover
                        </div>
                    )}
                </div>
            </div>

            {/* Turmas selecionadas (se houver) */}
            {selectedCount > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        Turmas Selecionadas ({selectedCount})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedClasses.map(code => {
                            const classInfo = getClassByCode(code);
                            if (!classInfo) return null;

                            return (
                                <div
                                    key={code}
                                    onClick={() => handleClassToggle(code)}
                                    className="relative p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl cursor-pointer hover:shadow-md transition-all group"
                                >
                                    {/* Badge de remover */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveClass(code, e)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>

                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h5 className="font-bold text-green-900 text-lg">
                                                {classInfo.code}
                                            </h5>
                                            <div className="p-1.5 bg-green-200 rounded-lg">
                                                <FaCheckCircle className="text-green-600" />
                                            </div>
                                        </div>

                                        {classInfo.course && (
                                            <p className="text-green-800 text-sm font-medium">
                                                {classInfo.course}
                                            </p>
                                        )}

                                        {classInfo.name && classInfo.name !== classInfo.code && (
                                            <p className="text-gray-700 text-sm">
                                                {classInfo.name}
                                            </p>
                                        )}

                                        <div className="pt-2 border-t border-green-200">
                                            <div className="text-xs text-green-700">
                                                <span className="font-medium">Clique para remover</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Lista de turmas disponíveis */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Turmas Disponíveis ({classes.length})
                </h4>

                {classes.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <FaUsers className="text-gray-300 text-3xl mx-auto mb-3" />
                        <p className="text-gray-500">Nenhuma turma disponível</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Cadastre turmas primeiro no sistema
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {visibleClasses.map(classInfo => {
                                const isSelected = selectedClasses.includes(classInfo.code);
                                const isDisabled = !isSelected && selectedCount >= maxSelection;

                                return (
                                    <div
                                        key={classInfo._id}
                                        onClick={() => !isDisabled && handleClassToggle(classInfo.code)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                                ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-sm'
                                                : isDisabled
                                                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                    : 'border-gray-200 hover:border-red-300 hover:shadow-md bg-white'
                                            }`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <h5 className={`font-bold text-lg ${isSelected ? 'text-red-900' : 'text-gray-900'
                                                    }`}>
                                                    {classInfo.code}
                                                </h5>

                                                {isSelected ? (
                                                    <div className="p-1.5 bg-red-500 rounded-lg">
                                                        <FaCheckCircle className="text-white text-sm" />
                                                    </div>
                                                ) : (
                                                    <div className={`p-1.5 rounded-lg ${isDisabled ? 'bg-gray-200' : 'bg-gray-100'
                                                        }`}>
                                                        <FaPlusCircle className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-500'
                                                            }`} />
                                                    </div>
                                                )}
                                            </div>

                                            {classInfo.course && (
                                                <p className={`text-sm font-medium ${isSelected ? 'text-red-800' : 'text-gray-700'
                                                    }`}>
                                                    {classInfo.course}
                                                </p>
                                            )}

                                            {classInfo.name && classInfo.name !== classInfo.code && (
                                                <p className={`text-sm ${isSelected ? 'text-red-700' : 'text-gray-600'
                                                    }`}>
                                                    {classInfo.name}
                                                </p>
                                            )}

                                            {/* Status/Informações adicionais */}
                                            <div className="pt-2 border-t border-gray-100">
                                                {isDisabled ? (
                                                    <div className="text-xs text-red-600 font-medium">
                                                        Limite máximo atingido
                                                    </div>
                                                ) : isSelected ? (
                                                    <div className="text-xs text-green-600 font-medium">
                                                        ✓ Selecionada
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-500">
                                                        Clique para selecionar
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Botão "Ver mais" se houver muitas turmas */}
                        {hasMoreClasses && (
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => setShowAll(!showAll)}
                                    className="px-6 py-2.5 text-red-600 hover:text-red-800 font-medium rounded-lg border border-red-200 hover:border-red-300 bg-white hover:bg-red-50 transition-colors"
                                >
                                    {showAll ? 'Mostrar menos' : `Ver todas as ${classes.length} turmas`}
                                </button>
                            </div>
                        )}

                    </>
                )}
            </div>
        </div>
    );
}