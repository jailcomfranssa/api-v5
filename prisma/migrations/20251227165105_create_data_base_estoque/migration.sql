-- CreateEnum
CREATE TYPE "MOVIMENTO" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "estoque" (
    "id" SERIAL NOT NULL,
    "tipo_movimento" "MOVIMENTO" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data_movimento" TIMESTAMP(3) NOT NULL,
    "origem_destino" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
