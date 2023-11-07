export function requiredParamNumber(param: string): number {
    return requiredParam(param, (val) => parseInt(val, 10));
}

export function requiredParam<T>(param: string | null | undefined, type: (value: string) => T): T {
    if (param == null)
        throw new Error(`Missing parameter ${name}`);
    return type(param);
}
