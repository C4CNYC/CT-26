export type DeepPartial<T> = T extends null | undefined
  ? T
  : T extends Array<infer ArrayType>
    ? Array<DeepPartial<ArrayType>>
    : T extends Record<string | number | symbol, unknown>
      ? { [P in keyof T]?: DeepPartial<T[P]> }
      : T
