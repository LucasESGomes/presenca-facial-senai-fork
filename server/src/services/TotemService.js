import BaseService from "./BaseService.js";
import { NotFoundError, UnauthorizedError } from "../errors/appError.js";
import Totem from "../models/totemModel.js";
import crypto from "crypto";

class TotemService extends BaseService {
    constructor() {
        super(Totem);
    }

    /**
     * Ativa ou desativa um totem
     */
    async toggleTotemStatus(totemId) {
        const totem = await this.model.findById(totemId);
        if (!totem) throw new NotFoundError("Totem não encontrado.");

        const updated = await this.model.findByIdAndUpdate(
            totemId,
            { isActive: !totem.isActive },
            { new: true, fields: { apiKey: 0 } } // remove apiKey da resposta
        );

        return updated;
    }


    /**
     * Autenticação do Totem via apiKey
     * Usado pelo middleware
     */
    async getByApiKey(apiKey) {
        const totem = await this.model
            .findOne({ apiKey })
            .select("+apiKey");

        if (!totem) {
            throw new UnauthorizedError("Totem inválido.");
        }

        if (!totem.isActive) {
            throw new UnauthorizedError("Totem desativado.");
        }

        return totem;
    }

    /**
     * Retorna apiKey (uso administrativo)
     * Ex: exibir uma única vez após criação
     */
    async getApiKeyByTotemId(totemId) {
        const totem = await this.model
            .findById(totemId)
            .select("+apiKey");

        if (!totem) {
            throw new NotFoundError("Totem não encontrado.");
        }

        return {
            id: totem._id,
            name: totem.name,
            apiKey: totem.apiKey,
        };
    }
    /**
     * Regenera a apiKey do totem
     */
    async regenerateToken(totemId) {
        const totem = await this.model
            .findById(totemId)
            .select("+apiKey");
        if (!totem) {
            throw new NotFoundError("Totem não encontrado.");
        }

        // Gerar nova apiKey
        totem.apiKey = crypto.randomBytes(32).toString("hex").substring(0, 10);
        await totem.save();
        return totem;
    }
}

export default new TotemService();
