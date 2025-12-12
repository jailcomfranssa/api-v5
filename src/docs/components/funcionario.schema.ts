// docs/components/funcionario.schema.ts

export const funcionarioSchema = {
    Funcionario: {
        type: "object",
        properties: {
            id: { type: "number" },
            cpf: { type: "string" },
            cargo: { type: "string" },
            salario: { type: "number" },
            telefone: { type: "string" },
            dataAdmissao: { type: "string", format: "date" },
            userId: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },

    CreateFuncionarioDTO: {
        type: "object",
        required: ["cpf", "cargo", "salario", "dataAdmissao"],
        properties: {
            cpf: { type: "string", example: "12345698745" },
            cargo: { type: "string", example: "Atendente" },
            salario: { type: "number", example: 2500 },
            telefone: { type: "string", example: "11999999999" },
            dataAdmissao: {
                type: "string",
                format: "date",
                example: "2024-01-20",
            },
            userId: {
                type: "number",
                description: "Apenas ADMIN pode enviar este campo",
                example: 3,
            },
        },
    },

    UpdateFuncionarioDTO: {
        type: "object",
        properties: {
            cargo: { type: "string" },
            salario: { type: "number" },
            telefone: { type: "string" },
            dataAdmissao: { type: "string", format: "date" },
        },
    },
};
