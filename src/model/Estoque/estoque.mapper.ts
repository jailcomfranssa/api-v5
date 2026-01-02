import { EstoqueResponseDTO } from "./estoque.repository";
export class EstoqueMapper {
    static toResponse(entity: any): EstoqueResponseDTO {
        return {
            id: entity.id,
            tipo_movimento: entity.tipo_movimento,
            quantidade: entity.quantidade,
            data_movimento: entity.data_movimento,
            origem_destino: entity.origem_destino,
            observacoes: entity.observacoes,
            produto: {
                id: entity.produto.id,
                nome: entity.produto.nome,
            },
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toResponseList(entities: any[]): EstoqueResponseDTO[] {
        return entities.map(this.toResponse);
    }
}
