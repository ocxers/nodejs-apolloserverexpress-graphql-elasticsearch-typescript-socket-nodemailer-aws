import { defaultFieldResolver } from 'graphql'
import ensureAuthenticated from '@/middleware/authentication'

const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils')

function authDirective(schema: any, directiveName: any) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: { resolve: any }) => {
      // Check whether this field has the specified directive
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if (upperDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source: any, args: any, context: any, info: any) {
          ensureAuthenticated(context.req, context.res, context.next)

          // https://www.graphql-tools.com/docs/schema-directives#enforcing-access-permissions
          return resolve(source, args, context, info)
        }
        return fieldConfig
      }
    }
  })
}

export default authDirective
