export const userSchema = {
    User: {
        type: "object",
        properties: {
            id: { type: "string", format: "number" },
            nome: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        }
    },

    CreateUserDTO: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
            nome: { type: "string" },
            email: { type: "string" },
            senha: { type: "string", minLength: 6 }
        }
    },

    UpdateUserDTO: {
        type: "object",
        properties: {
            nome: { type: "string" },
            email: { type: "string" },
            senha: { type: "string", minLength: 6 }
        }
    }
};
