import { GraphQLSchema } from 'graphql'
import { JsonFileHandlerTypes } from '../handlers/types'

export type MeshConfig = {
  sources: SourceConfig[]
}

export interface SourceConfig {
  name: string,
  handler: Handler,
  namespace?: string,
}

export type GetMeshSourceOptions<THandlerConfig, TIntrospectionCache = never> = {
  name: string
  config: THandlerConfig
  baseDir?: string
  // cache: KeyValueCache
  // pubsub: MeshPubSub
  introspectionCache?: TIntrospectionCache
}

export interface Handler {
  jsonFile?: JsonFileHandlerTypes.Config
}

export type MeshSource<ContextType = any, InitialContext = any> = {
  schema: GraphQLSchema
  executor?: any
  subscriber?: any
  contextVariables?: (keyof InitialContext)[]
  contextBuilder?: (initialContextValue: InitialContext) => Promise<ContextType>
  batch?: boolean
}

/** Interface to implement to add a custom handler */
export interface MeshHandlerType<TContext = any> {
  getMeshSource: () => Promise<MeshSource<TContext>>
}

export type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;

export namespace Context {
  export interface BuildContext {

  }
}
