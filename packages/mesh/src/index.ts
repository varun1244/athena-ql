import { Class, Handler, MeshConfig, MeshHandlerType, MeshSource } from './types/mesh.types'
import Path from './common/path'
import Context from './models/context'
import { HandlerResolver } from './handlers'
import { schemaComposer } from 'graphql-compose'

export default class AthenaMesh {
  private context: Context
  private resolver: HandlerResolver
  constructor(customResolver?: any) {
    this.context = new Context()
    this.resolver = new HandlerResolver(customResolver)
  }

  generateSchema = async (opt: { file?: string, config?: MeshConfig }) => {
    const config: MeshConfig = opt.config || await Path.readConfigFromPath(opt.file)
    const source = config.sources[0]
    const handler = this.resolver.loadHandlerByName(source, this.context)
    const meshSchema = handler.getMeshSource()
    this.context.newSourceContext(source.name, handler.getMeshSource())
    return meshSchema
  }
}
