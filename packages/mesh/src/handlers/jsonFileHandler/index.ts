import { ObjectTypeComposer, ObjectTypeComposerDefinition, SchemaComposer } from 'graphql-compose';

import { JsonFileHandlerTypes } from '../types'
import Path from '../../common/path'
import { MeshHandlerType, SourceConfig } from '../../types/mesh.types';
import Context from '../../models/context';
import OperationGenerator from './operations';

export default class JsonHandler implements MeshHandlerType<Context> {
  context: Context;
  config: SourceConfig;
  name: string;
  composer: SchemaComposer<any>;

  constructor(config: SourceConfig, context: any) {
    this.config = config
    this.context = context
    this.name = config.name
    this.composer = new SchemaComposer()
  }

  getMeshSource = async () => {
    const handler: JsonFileHandlerTypes.Config = this.config.handler.jsonFile
    await this.createTypes(handler!.resources)
    return {
      schema: this.composer.buildSchema()
    }
  }

  private createTypes = async (resources: JsonFileHandlerTypes.ResourceConfig[]) => {
    if (!resources || !Array.isArray(resources)) throw (`No resources configured for JsonHandler in ${this.name}`)
    await Promise.all(resources.map(this.generateResourceType))
    console.log(this.composer.toSDL())
  }

  private generateResourceType = async (resource: JsonFileHandlerTypes.ResourceConfig): Promise<ObjectTypeComposer<any, any>> => {
    const schema: ObjectTypeComposerDefinition<any, any> = resource.schema || await Path.readConfigFromPath(resource.schemaPath)
    const objectType = this.composer.createObjectTC(schema)
    new OperationGenerator(resource, objectType, this.composer)
    return objectType
  }
}

export {
  JsonFileHandlerTypes
}
