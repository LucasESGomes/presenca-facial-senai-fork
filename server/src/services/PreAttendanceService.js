import redis from "../config/redis.js";

class PreAttendanceService {

    getKey(roomId) {
        return `pre_attendance:room:${roomId}`;
    }

    async create({ roomId, studentId }) {
        const key = this.getKey(roomId);

        const payload = {
            studentId,
            timestamp: Date.now()
        };

        await redis.rpush(key, JSON.stringify(payload));
        await redis.expire(key, 60 * 60 * 2);

        console.log("🟡 [PRE] SALVO", {
            key,
            payload
        });
    }

    async getByRoom(roomId) {
        const key = this.getKey(roomId);

        const data = await redis.lrange(key, 0, -1);
        const parsed = data.map(JSON.parse);

        console.log("🔵 [PRE] LIDO", {
            key,
            total: parsed.length,
            parsed
        });

        return parsed;
    }

    async clearRoom(roomId) {
        const key = this.getKey(roomId);

        await redis.del(key);

        console.log("🔴 [PRE] LIMPO", { key });
    }
}

export default new PreAttendanceService();
