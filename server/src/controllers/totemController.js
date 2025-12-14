import ApiResponse from "../utils/ApiResponse.js";
import TotemService from "../services/TotemService.js";
import RoomService from "../services/RoomService.js";
import controllerWrapper from "../utils/controllerWrapper.js";

const totemController = {
    /**
     * Ativa ou desativa o totem.
     * Método alterado para trabalhar com apiKey para garantir a autenticação.
     */
    toggleStatus: controllerWrapper(async (req, res) => {
        const totemId = req.params.id;
        const updatedTotem = await TotemService.toggleTotemStatus(totemId);
        return ApiResponse.OK(res, "Status do totem atualizado com sucesso.", updatedTotem);
    }),

    /**
     * Recupera todos os totens. 
     */
    getAll: controllerWrapper(async (req, res) => {
        const totems = await TotemService.getAll();
        return ApiResponse.OK(res, "", totems);
    }),

    /**
     * Recupera um totem específico pelo ID. 
     * Deveria ser chamado via apiKey no header para autenticação
     */
    getById: controllerWrapper(async (req, res) => {
        const id = req.params.id;
        const totem = await TotemService.getById(id);
        return ApiResponse.OK(res, "", totem);
    }),

    /**
     * Criação de um novo totem.
     * Após a criação, a chave (apiKey) será gerada e deve ser mostrada para o administrador.
     */
    create: controllerWrapper(async (req, res) => {
        // Verifica se a sala associada existe
        const { room } = req.body;
        const roomObj = await RoomService.getById(room);
        if (!roomObj) {
            return ApiResponse.BADREQUEST(res, "Sala associada não encontrada.");
        }
        const totem = await TotemService.create(req.body);
        return ApiResponse.CREATED(res, "Totem criado com sucesso.", totem);
    }),

    /**
     * Atualiza um totem. 
     * Modifica a configuração do totem existente (nome, status, etc.).
     */
    update: controllerWrapper(async (req, res) => {
        const id = req.params.id;
        if (req.body.room) {
            // Verifica se a sala associada existe
            const roomObj = await RoomService.getById(req.body.room);
            if (!roomObj) {
                return ApiResponse.BADREQUEST(res, "Sala associada não encontrada.");
            }
        }
        const updatedTotem = await TotemService.update(id, req.body);
        return ApiResponse.OK(res, "Totem atualizado com sucesso.", updatedTotem);
    }),

    /**
     * Deleta um totem.
     * Removerá o totem da base de dados.
     */
    delete: controllerWrapper(async (req, res) => {
        const id = req.params.id;
        await TotemService.delete(id);
        return ApiResponse.OK(res, "Totem deletado com sucesso.");
    }),

    /**
     * Gera e retorna a chave do totem (apiKey) após a criação.
     * Isso permite que o coordenador/admin visualize a chave do totem para vinculação futura.
     */
    getApiKey: controllerWrapper(async (req, res) => {
        const totemId = req.params.id;
        const totemApiKey = await TotemService.getApiKeyByTotemId(totemId);
        return ApiResponse.OK(res, "Chave do totem gerada com sucesso.", totemApiKey);
    }),

    /**
     * Método adicional para regenerar a apiKey do totem, se necessário.
     * Isso pode ser útil se a chave for comprometida.
     */
    regenerateApiKey: controllerWrapper(async (req, res) => {
        const totemId = req.params.id;
        const updatedTotem = await TotemService.regenerateToken(totemId);
        return ApiResponse.OK(res, "Chave do totem regenerada com sucesso.", updatedTotem);
    })
    
};

export default totemController;
