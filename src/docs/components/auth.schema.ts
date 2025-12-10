// doc/components/auth.schema.ts
export const authSchema = {
    LoginDTO: {
        type: "object",
        required: ["email", "senha"],
        properties: {
            email: { type: "string" },
            senha: { type: "string", minLength: 6 },
        },
    },

    LoginResponse: {
        type: "object",
        properties: {
            token: { type: "string" },
            user: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    email: { type: "string" },
                    role: { type: "string" },
                },
            },
        },
    },
};
