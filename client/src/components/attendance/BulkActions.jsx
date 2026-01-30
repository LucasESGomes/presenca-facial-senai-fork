export default function BulkActions({
    selectedStudents,
    totalStudents,
    actionType,
    onSelectAll,
    onActionTypeChange,
    onApplyBulkAction
}) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onSelectAll}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                        {selectedStudents.length === totalStudents ? "Desmarcar todos" : "Selecionar todos"}
                    </button>
                    <span className="text-gray-600 text-sm">
                        {selectedStudents.length} aluno(s) selecionado(s)
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={actionType}
                        onChange={onActionTypeChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">Ação em massa</option>
                        <option value="presente">Marcar como presente</option>
                        <option value="atrasado">Marcar como atrasado</option>
                        <option value="ausente">Marcar como ausente</option>
                    </select>

                    <button
                        onClick={onApplyBulkAction}
                        disabled={!selectedStudents.length || !actionType}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStudents.length && actionType ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
}