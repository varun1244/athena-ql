import { MeshConfig } from '../../src/types/mesh.types'

const meshConfig: MeshConfig = {
  sources: [{
    name: 'Todo',
    handler: {
      jsonFile: {
        resources: [{
          schema: {
            name: 'TodoList',
            fields: {
              id: 'Int!',
              title: 'String',
              description: 'String',
              completed: '[Boolean]'
            }
          },
          output: '/tmp/Todo.json'
        }, {
          schema: {
            name: 'User',
            fields: {
              id: 'Int!',
              name: 'String'
            }
          },
          output: '/tmp/User.json'
        }]
      }
    },
  }]
}

export {
  meshConfig
}
