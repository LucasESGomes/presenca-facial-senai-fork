import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("Mongo URI:", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: "presenca_facial_senai"});
        console.log(`✅ MongoDB conectado ${process.env.MONGO_URI}`);
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error.message);
        process.exit(1);
    }
};
