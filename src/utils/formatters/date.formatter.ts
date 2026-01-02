export function formatDateBR(date?: Date | null): string | null {
    if (!date || !(date instanceof Date)) return null;

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    return `${dia}-${mes}-${ano}`;
}
