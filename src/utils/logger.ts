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
  static records: string[] = []

  static dump() {
    return this.records.join('\n')
  }

  static log(content: any, record = true) {
    const s = parseString(content)
    console.log(s)
    record && this.records.push(s)
  }

  static success(content: any, record = true) {
    this.log(`✅ ${parseString(content)}`, record)
  }

  static warn(content: any, record = true) {
    this.log(`⚠︎ ${parseString(content)}`, record)
  }

  static error(content: any, record = true) {
    this.log(`❌ ${parseString(content)}`, record)
  }
}

export const logger = Logger
