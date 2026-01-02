import { formatDateBR } from "./date.formatter";
import { formatCurrencyBR } from "./currency.formatter";

/* =========================
 * REGRAS SUPORTADAS
 * ========================= */
export type NormalizerRule = "date" | "currency";

/* =========================
 * CONFIGURAÇÃO POR ENTIDADE
 * ========================= */
export type NormalizerConfig<T> = Partial<Record<keyof T, NormalizerRule>>;

/* =========================
 * TRANSFORMAÇÃO DE TIPOS
 * Converte Date → string
 * ========================= */
export type NormalizeEntity<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends object
        ? NormalizeEntity<T[K]>
        : T[K];
};

/* =========================
 * OVERLOADS
 * ========================= */
export function normalizeEntity<T>(
    data: T,
    config: NormalizerConfig<T>
): NormalizeEntity<T>;

export function normalizeEntity<T>(
    data: T[],
    config: NormalizerConfig<T>
): NormalizeEntity<T>[];

/* =========================
 * IMPLEMENTAÇÃO
 * ========================= */
export function normalizeEntity<T>(
    data: T | T[],
    config: NormalizerConfig<T>
): NormalizeEntity<T> | NormalizeEntity<T>[] {
    if (Array.isArray(data)) {
        return data.map((item) => normalizeEntity(item, config)) as any;
    }

    const normalized = { ...data } as any;

    for (const key in config) {
        const rule = config[key];
        const value = (data as any)[key];

        if (value == null) continue;

        if (rule === "date" && value instanceof Date) {
            normalized[key] = formatDateBR(value);
        }

        if (rule === "currency") {
            normalized[key] = formatCurrencyBR(value);
        }
    }

    return normalized;
}
