import { ObjectTypeComposer, SchemaComposer } from 'graphql-compose';
import { JsonDB } from 'node-json-db'
const fs = require('fs')
const path = require('path');

import { JsonFileHandlerTypes } from '../types';

class OperationGenerator {
  objectType: ObjectTypeComposer<any, any>;
  resource: JsonFileHandlerTypes.ResourceConfig;
  ops: JsonFileHandlerTypes.Operations[];
  composer: SchemaComposer<any>;
  db: JsonDB;
  paths: { absPath: any; relativePath: string; };

  constructor(resource: JsonFileHandlerTypes.ResourceConfig, objectType: ObjectTypeComposer<any, any>, composer: SchemaComposer<any>) {
    this.resource = resource
    this.objectType = objectType
    this.composer = composer
    this.ops = resource.operations || this.getDefaultOps()
    this.paths = this.sourceOutput()
    this.db = new JsonDB(this.resource.output, true, true, '/')
    this.db.push('/data', [], true)
    this.generateOperations()
  }

  sourceOutput = () => {
    const op = this.resource.output.split('/').slice(0, -1)
    const file = this.resource.output
    if (op.length) {
      fs.mkdir(path.join(process.cwd(), op.join('/')), { recursive: true }, () => { })
    }
    fs.open(path.join(process.cwd(), file), 'w+', () => { })
    return {
      absPath: path.join(process.cwd(), file),
      relativePath: file
    }
  }

  getDefaultOps = () => {
    return Object.values(JsonFileHandlerTypes.Operations)
  }

  generateOperations = () => {
    this.ops.map(async op => {
      if (!this.operationMap[op]) {
        console.warn('No handler found for operation ', op)
      } else {
        this.operationMap[op].apply(this)
      }
    })
  }

  syncData = async () => {
    fs.writeFile(this.paths.absPath, JSON.stringify(this.db.getData('/data')), () => { })
  }

  create = () => {
    const name = this.objectType.getTypeName()
    const type = this.objectType.getType()
    const inputType = this.objectType.getITC()

    this.objectType.addResolver({
      name: `create`,
      args: {
        input: inputType
      },
      type: type,
      resolve: async (param) => {
        const count = await this.db.count('/data')
        const newObj = { id: count }
        console.log(count, newObj)
        await this.db.push('/data[]', { id: count }, true)
        this.syncData()
        return newObj
      }
    })
    // this.composer.m
    this.composer.Mutation.addFields({
      [`create${name}`]: this.objectType.getResolver('create')
    })
  }

  read = () => {
    const name = this.objectType.getTypeName()
    this.objectType.addResolver({
      name: `read`,
      args: { id: 'Int' },
      type: this.objectType.getType(),
      resolve: async ({ source, args }) => {
        return this.db.find('/data', (value) => {
          return value.id == args.id
        })
      }
    })
    this.composer.Query.addFields({
      [`get${name}ById`]: this.objectType.getResolver('read')
    })
  }

  readAll = () => {
    const name = this.objectType.getTypeName()
    this.objectType.addResolver({
      name: `readAll`,
      type: [this.objectType.getType()],
      resolve: async (...params) => {
        return this.db.getData('/data')
      }
    })
    this.composer.Query.addFields({
      [`get${name}s`]: this.objectType.getResolver('readAll')
    })
  }

  private operationMap = {
    [JsonFileHandlerTypes.Operations.create]: this.create,
    [JsonFileHandlerTypes.Operations.read]: this.read,
    [JsonFileHandlerTypes.Operations.readAll]: this.readAll
  }
}

export default OperationGenerator
