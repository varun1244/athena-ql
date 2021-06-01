import AthenaMesh from '@athena-ql/mesh'
import { meshConfig } from './config'
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';

const PORT = 4000;
const app: Express = express()


const main = async () => {
  const mesh = new AthenaMesh()
  const { schema } = await mesh.generateSchema({ config: meshConfig })

  const PORT = 4000

  app.use(
    '/graphql',
    graphqlHTTP(async (request, response, graphQLParams) => {
      return {
        schema,
        graphiql: true,
        context: {
          req: request,
        },
      };
    })
  );

  app.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}/graphql`);
  })
}

main()
