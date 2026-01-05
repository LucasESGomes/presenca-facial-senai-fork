import ApiResponse from "../utils/ApiResponse.js";
import UserService from "../services/UserService.js";
import controllerWrapper from "../utils/controllerWrapper.js";

const userController = {
    create: controllerWrapper(async (req, res) => {
        const user = await UserService.create(req.body);
        return ApiResponse.CREATED(res, "Usuário criado com sucesso.", user);
    }),

    getAll: controllerWrapper(async (req, res) => {
        const users = await UserService.getAll();
        return ApiResponse.OK(res, "", users);
    }),

    getMe: controllerWrapper(async (req, res) => {
        return ApiResponse.OK(res, "", req.user);
    }),

    getById: controllerWrapper(async (req, res) => {
        const id = req.params.id;
        const user = await UserService.getById(id);
        return ApiResponse.OK(res, "", user);
    }),

    changePassword: controllerWrapper(async (req, res) => {
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const id = req.user.id;

        if (!oldPassword || !newPassword || !confirmNewPassword){
            return ApiResponse.BADREQUEST(res, "Todos os campos são obrigatórios.");
        }

        if (confirmNewPassword != newPassword) {
            return ApiResponse.BADREQUEST(res, "As senhas não coincidem.");
        }

        const updatedUser = await UserService.updatePassword(id, oldPassword, newPassword);
        return ApiResponse.OK(res, "Senha atualizada com sucesso.", updatedUser);
    }),

    activateUser: controllerWrapper(async (req, res) =>{
        const id = req.params.id;
        
        const updatedUser = await UserService.update(id, {isActive: true});

        return ApiResponse.OK(res, "Usuário ativado com sucesso.", updatedUser);
    }),

    deactivateUser: controllerWrapper(async (req, res) =>{
        const id = req.params.id;
        
        const updatedUser = await UserService.update(id, {isActive: false});

        return ApiResponse.OK(res, "Usuário desativado com sucesso.", updatedUser);
    }),

    updateUser: controllerWrapper(async (req, res) =>{
        const id = req.params.id;
        const updatedUser = await UserService.update(id, req.body);

        return ApiResponse.OK(res, "Usuário atualizado com sucesso.", updatedUser);
    }),

    deleteUser: controllerWrapper(async (req, res) =>{
        const id = req.params.id;

        const deletedUser = await UserService.delete(id);

        return ApiResponse.NO_CONTENT(res, "Usuário deletado com sucesso.")
    }),

};

export default userController;
