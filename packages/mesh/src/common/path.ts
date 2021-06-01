import isUrl from 'is-url'
import { isAbsolute, resolve } from 'path'
import { promises as fsPromises } from 'fs'
import { load as loadYaml } from 'js-yaml'

const { readFile, stat } = fsPromises || {};

class Path {

  isUrl = (path: string): boolean => {
    return isUrl(path)
  }

  readConfigFromPath = (path: string): Promise<any> => {
    if (isUrl(path)) {
      throw new Error('Remote config files are not supported currently')
    } else {
      return this.readFromFile(path)
    }
  }

  resolvePath = (filePath: string) => isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);

  readFromFile = async (path: string): Promise<any> => {
    const filePath = this.resolvePath(path)
    const stats = await stat(filePath);
    let result: any = await readFile(filePath, 'utf-8')
    if (/json$/.test(filePath)) {
      result = JSON.parse(result);
    } else if (/yaml$/.test(filePath) || /yml$/.test(filePath)) {
      result = loadYaml(result);
    } else {
      throw new Error(
        `Failed to parse JSON/YAML. Ensure file '${filePath}' has ` +
        `the correct extension (i.e. '.json', '.yaml', or '.yml).`
      );
    }
    return result;
  }

}

export default new Path()
