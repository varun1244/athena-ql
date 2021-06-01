import Context from '../models/context'
import { Class, Handler, MeshHandlerType, SourceConfig } from '../types/mesh.types'
import JsonFileHandler from './jsonFileHandler/index'

class HandlerResolver {
  private handleMap: { [Property in keyof Handler]: Class<MeshHandlerType> } = {
    'jsonFile': JsonFileHandler,
  }

  constructor(customHandlers?: { [Property in keyof Handler]: Class<MeshHandlerType> }) {
    if (customHandlers) {
      Object.keys(customHandlers).map(handlerKey => {
        this.handleMap[handlerKey] = customHandlers[handlerKey]
      })
    }
  }

  loadHandlerByName = (source: SourceConfig, context: Context): MeshHandlerType => {
    const handlerTypes = Object.keys(source.handler)
    if (handlerTypes.length !== 1) {
      throw new Error(`Multiple handler configurations found for source "${source.name}"`)
    }
    return new this.handleMap[handlerTypes[0]](source, context)
  }
}

export {
  HandlerResolver,
  JsonFileHandler
}
