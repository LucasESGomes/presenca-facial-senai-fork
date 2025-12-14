import ApiResponse from "../utils/ApiResponse.js";
import RoomService from "../services/RoomService.js";
import controllerWrapper from "../utils/controllerWrapper.js";

const roomController = {

    // Criar sala
    create: controllerWrapper(async (req, res) => {
        const room = await RoomService.create(req.body);
        return ApiResponse.CREATED(res, "Sala criada com sucesso.", room);
    }),

    // Listar todas as salas
    getAll: controllerWrapper(async (req, res) => {
        const rooms = await RoomService.getAll();
        return ApiResponse.OK(res, "", rooms);
    }),

    // Buscar sala por ID
    getById: controllerWrapper(async (req, res) => {
        const room = await RoomService.getById(req.params.id);
        return ApiResponse.OK(res, "", room);
    }),

    // Atualizar sala
    update: controllerWrapper(async (req, res) => {
        const updated = await RoomService.update(req.params.id, req.body);
        return ApiResponse.OK(res, "Sala atualizada com sucesso.", updated);
    }),

    // Ativar / Desativar sala
    updateStatus: controllerWrapper(async (req, res) => {
        const room = await RoomService.getById(req.params.id);
        const updated = await RoomService.update(req.params.id, {
            isActive: !room.isActive
        });
        return ApiResponse.OK(res, "Status da sala atualizado com sucesso.", updated);
    }),

    // Deletar sala
    delete: controllerWrapper(async (req, res) => {
        await RoomService.delete(req.params.id);
        return ApiResponse.NO_CONTENT(res, "Sala removida com sucesso.");
    })
};

export default roomController;
