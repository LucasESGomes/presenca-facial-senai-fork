import mongoose from 'mongoose';
import crypto from 'crypto';

const totemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        // Referência à sala física onde o totem está instalado
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },

        // Chave de autenticação do totem
        apiKey: {
            type: String,
            required: true,
            unique: true,
            index: true,
            select: false, // 🔐 Não retornar a chave por padrão
        },

        // Data da última vez que o totem foi visto
        lastSeenAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Gerar a apiKey automaticamente quando o totem é criado
totemSchema.pre('validate', function (next) {
    if (!this.apiKey) {
        // gerando uma chave aleatória de 32 bytes e convertendo para hexadecimal, salvando apenas 10 caracteres
        this.apiKey = crypto.randomBytes(32).toString('hex').substring(0, 10);
    }
    next();
});

const Totem = mongoose.model('Totem', totemSchema);

export default Totem;