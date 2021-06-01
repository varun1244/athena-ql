import { ObjectTypeComposer, ObjectTypeComposerDefinition } from "graphql-compose"

namespace JsonFileHandlerTypes {
  export type Config = {
    resources: ResourceConfig[]
  }

  export type ResourceConfig = {
    schema?: ObjectTypeComposerDefinition<any, any>,
    schemaPath?: string,
    /** Output file path should be relative to CWD */
    output: string,
    operations?: Operations[]
  }

  export enum Operations {
    create = 'create',
    update = 'update',
    delete = 'delete',
    read = 'read',
    readAll = 'readAll'
  }
}

export default JsonFileHandlerTypes
