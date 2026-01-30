import { FiCheck, FiClock, FiX } from "react-icons/fi";

export default function AttendanceActions({
    student,
    onMarkPresent,
    onMarkLate,
    onMarkAbsent,
}) {
    return (
        <div className="flex items-center space-x-2">
            {/* Presente */}
            <button
                onClick={() => onMarkPresent(student)}
                title="Marcar como presente"
                aria-label="Marcar como presente"
                className="p-2 rounded-full text-green-700 bg-green-100 hover:bg-green-200 hover:scale-110 z-40 transition-all"
            >
                <FiCheck className="w-5 h-5" />
            </button>

            {/* Atrasado */}
            <button
                onClick={() => onMarkLate(student)}
                title="Marcar como atrasado"
                aria-label="Marcar como atrasado"
                className="p-2 rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 hover:scale-110 z-40 transition-all"
            >
                <FiClock className="w-5 h-5" />
            </button>

            {/* Ausente */}
            <button
                onClick={() => onMarkAbsent(student)}
                title="Marcar como ausente"
                aria-label="Marcar como ausente"
                className="p-2 rounded-full text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 z-40 transition-all"
            >
                <FiX className="w-5 h-5" />
            </button>
        </div>
    );
}
