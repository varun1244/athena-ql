import isUrl from 'is-url'

class Utilities {

  isUrl = (path: string): boolean => {
    return isUrl(path)
  }

  readFromFile = async (path: string): Promise<any> => {
  }

}

export default new Utilities()
