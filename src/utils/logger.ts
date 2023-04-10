function parseString(content: any) {
  if (content instanceof Error) {
    return `\n` +
      `[错误名称]：${content.name}\n` + 
      `[错误信息]：${content.message}\n` + 
      `[错误位置]：${content.stack?.split?.('\n')?.[1]?.trim?.()}\n`
  }

  if (typeof content === 'object') {
    return JSON.stringify(content)
  }

  return `${content}`
}

export class Logger {
  static log(content: any) {
    console.log(parseString(content) + '\n')
  }

  static success(content: any) {
    console.log(`✅ ${parseString(content)}`)
  }

  static warn(content: any) {
    console.log(`⚠︎ ${parseString(content)}`)
  }

  static error(content: any) {
    console.log(`❌ ${parseString(content)}`)
  }
}

export const logger = Logger
