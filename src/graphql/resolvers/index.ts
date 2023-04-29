import auth from '@/graphql/resolvers/auth'

export default [
  {
    Query: {
      whoAmI: async () => {
        return 'Backend v1.0.0'
      }
    }
  },
  auth
]
