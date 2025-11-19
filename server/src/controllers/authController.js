import UserService from "../services/UserService.js"
import ApiResponse from "../utils/ApiResponse.js";
import JwtService from "../services/JwtService.js"
import handleControllerError from "../errors/handleControllerError.js";

const authController = {
    async login(req,res){
        try {
            const {email,password} = req.body;
            const foundUser = await UserService.matchUserLogin(email, password);
            if (foundUser) {
                const JwtToken = JwtService.createToken({
                    id: foundUser._id,
                    name: foundUser.name,
                    role: foundUser.role
                })

                return ApiResponse.OK(res, "", JwtToken)
            } else {
                return ApiResponse.UNAUTHORIZED(res, "Credenciais inválidas")
            }
        } catch (error) {
            handleControllerError(error, res)
        }
    }
}

export default authController;
