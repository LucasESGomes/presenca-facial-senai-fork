import { FiUserCheck, FiUserX, FiUsers, FiClock, FiCheck } from "react-icons/fi";

export default function StatsCards({ stats, sessionInfo }) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-green-800 font-medium">Presentes</p>
                        <p className="text-2xl font-bold text-green-900">{stats.present}</p>
                        <p className="text-xs text-green-700 mt-1">
                            {stats.total > 0 ? `${Math.round((stats.present / stats.total) * 100)}%` : '0%'}
                        </p>
                    </div>
                    <FiUserCheck className="w-8 h-8 text-green-600" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-yellow-800 font-medium">Atrasados</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.late || 0}</p>
                        <p className="text-xs text-yellow-700 mt-1">
                            {stats.total > 0 ? `${Math.round(((stats.late || 0) / stats.total) * 100)}%` : '0%'}
                        </p>
                    </div>
                    <FiClock className="w-8 h-8 text-yellow-600" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-red-800 font-medium">Ausentes</p>
                        <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
                        <p className="text-xs text-red-700 mt-1">
                            {stats.total > 0 ? `${Math.round((stats.absent / stats.total) * 100)}%` : '0%'}
                        </p>
                    </div>
                    <FiUserX className="w-8 h-8 text-red-600" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-800 font-medium">Total</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                    <FiUsers className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-purple-800 font-medium">Presença</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.percentage}%</p>
                    </div>
                    <FiCheck className="w-8 h-8 text-purple-600" />
                </div>
            </div>
        </div>
    );
}