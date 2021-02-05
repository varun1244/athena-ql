interface Permissions {
  permission_list: [Permission]
  use_allow_list: Boolean
  allow_list?: [GraphqlSchema]
  use_blocked_list: Boolean
  blocked_list?: [GraphqlSchema]
}

enum GraphqlTypes {
  Query,
  Mutation,
  Subscription,
  Types,
}

interface GraphqlSchema {
  name: String
  type: GraphqlTypes.Query | GraphqlTypes.Mutation | GraphqlTypes.Subscription
  inputs: [String]
  outputs: [String]
}

interface RolePermission {
  role_name: String
  set?: Object
  allowed_inputs?: [GraphqlSchema["inputs"]]
  allowed_outputs?: [GraphqlSchema["outputs"]]
}

interface Permission {
  action: GraphqlSchema
  permission_filter?: [RolePermission]
  context?: [GraphqlTypes.Types]
}
