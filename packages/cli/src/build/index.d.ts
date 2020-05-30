
export interface IBuildConfig {
  type: 'qa' | 'dev',
  configPath: string,
  debug: boolean,
  encoding: string,
}

export interface IBuildOptions {
  type: 'qa' | 'dev',
  debug?: boolean,
  encoding?: string,
  ossAccessUrl?: string,
  configPath?: string,
}

export interface IOssConfig {
  'OSS_KEY': string,
  'OSS_SECRET': string,
  'OSS_BUCKET': string,
  'OSS_REGION': string
}

export interface ISPaaSBuildConfig extends IOssConfig {
  UNIQUE_PROJECT_NAME: string,
  [propsName: string]: any
}

export interface IBuildFunc {
  checkConfigFileIfIgnore?: () => Promise<boolean>, // TODO 之后再实现改功能
  readConfigFile: () => IConfigOutput,
  buildProject: () => Promise<boolean>,
  transportFileToOss: () => Promise<boolean>
  parse: (src: string | Buffer,options?: IParseOptions) => IConfigOutput
}


export interface IParseOptions {
  /**
   * You may turn on logging to help debug why certain keys or values are not being set as you expect.
   */
  debug?: boolean;
}

export interface IParseOutput {
  [name: string]: string;
}

export interface IConfigOptions {
  /**
   * You may specify a custom path if your file containing environment variables is located elsewhere.
   */
  path?: string;

  /**
   * You may specify the encoding of your file containing environment variables.
   */
  encoding?: string;

  /**
   * You may turn on logging to help debug why certain keys or values are not being set as you expect.
   */
  debug?: boolean;
}

export interface IConfigOutput {
  error?: Error;
  parsed?: ISPaaSBuildConfig;
}

/**
 * Loads `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { parsed: { KEY: 'value' } }
 *
 * @param options - controls behavior
 * @returns an object with a `parsed` key if successful or `error` key if an error occurred
 *
 */
export function config(options?: IConfigOptions): IConfigOutput;