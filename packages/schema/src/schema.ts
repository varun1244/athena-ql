import { findAndParseConfig } from '@graphql-mesh/config'
import { getMesh } from '@graphql-mesh/runtime'
import { printSchemaWithDirectives } from '@graphql-tools/utils';

export default class Schema {
  constructor() {
    this.logConfig()
  }

  logConfig = async () => {
    const config = await findAndParseConfig({
      dir: './src/config'
    })
    // console.log(config)
    const { schema } = await getMesh(config)
    // console.log(JSON.stringify(introspectionFromSchema(schema)))
    const printedSchema = printSchemaWithDirectives(schema);
    console.log(printedSchema)
  }
}

new Schema()
