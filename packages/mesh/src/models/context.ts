export default class Context {
  private sourceMap = {};
  private opsContext: CurrentContext

  newSourceContext = (name: string, ops) => {
    if (this.sourceMap[name]) throw new Error(`Source with the name ${name} already exists`)
    this.sourceMap[name] = ops
  }

  setCurrentOperation = (request, ops, params = {}) => {
    this.opsContext = new CurrentContext(request, ops, params)
  }

  current = () => {
    this.current
  }
}

class CurrentContext {
  request: any;
  public readonly attributes: {};
  operation: any;
  params: any;

  constructor(request, ops, params) {
    this.request = request
    this.operation = ops
    this.params = params
  }

  setAttr = (name: string, value: any) => {
    this.attributes[name] = value
  }
}
