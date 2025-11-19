const healthController = {
    healthCheck: async function (req,res){
        res.json({ message: "API Presença Facial SENAI funcionando 🚀" });
    }
}

export default healthController