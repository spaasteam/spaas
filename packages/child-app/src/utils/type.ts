// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
// 获取数组值的字符串文字类型
export const tuple = <T extends string[]>(...args: T) => args

/**
 * https://stackoverflow.com/a/59187769
 * 在不执行索引的情况下提取数组/元组的元素类型
 */
export type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer E)[] ? E : never;
