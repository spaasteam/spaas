/**
 * @description: 导入非js文件官方声明
 * https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
 */

declare module '*!text' {
  const content: string
  export default content
}
declare module '*.json';
