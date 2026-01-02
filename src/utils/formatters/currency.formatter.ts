export function formatCurrencyBR(
    valor?: number | string | null
): string | null {
    if (valor === null || valor === undefined) return null;

    const numero = Number(valor);
    if (Number.isNaN(numero)) return null;

    return `R$ ${numero.toFixed(2).replace(".", ",")}`;
}
