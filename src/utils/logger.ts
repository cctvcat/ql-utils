export type Content = {
  prefix: string
  content: string
}

export type TableContent = {
  [key: string]: any
}

export type LinkContent = {
  value?: string
  link: string
}

export type ImgContent = {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
}

function parseString(content: string | Content) {
  return typeof content === 'string'
    ? content
    : `[${content.prefix}] ${content.content}`
}

export class Logger {
  static log(content: string | Content) {
    console.log(parseString(content) + '\n')
  }

  static success(content: string | Content) {
    console.log(`<div style="color: #67c23a">${parseString(content)}</div>`)
  }

  static warn(content: string | Content) {
    console.log(`<div style="color: #e6a23c">${parseString(content)}</div>`)
  }

  static error(content: string | Content) {
    console.log(`<div style="color: red">${parseString(content)}</div>`)
  }

  static h1(content: string | Content) {
    console.log(`<h1>${parseString(content)}</h1>`)
  }

  static h2(content: string | Content) {
    console.log(`<h2>${parseString(content)}</h2>`)
  }

  static h3(content: string | Content) {
    console.log(`<h3>${parseString(content)}</h3>`)
  }

  static h4(content: string | Content) {
    console.log(`<h4>${parseString(content)}</h4>`)
  }

  static h5(content: string | Content) {
    console.log(`<h5>${parseString(content)}</h5>`)
  }

  static h6(content: string | Content) {
    console.log(`<h6>${parseString(content)}</h6>`)
  }

  static bold(content: string | Content) {
    console.log(`<div style="font-weight: bold">${parseString(content)}</div>`)
  }

  static underline(content: string | Content) {
    console.log(
      `<div style="text-decoration: underline">${parseString(content)}</div>`
    )
  }

  static lineThrough(content: string | Content) {
    console.log(
      `<div style="text-decoration: line-through">${parseString(content)}</div>`
    )
  }

  static link(content: LinkContent) {
    console.log(
      `<a href="${content.link}">${content.value || content.link}</a>`
    )
  }

  static table(content: TableContent[]) {
    if (!Array.isArray(content) || content.length === 0) {
      return
    }
    const cols = Object.keys(content)
    const vals = content.map((e) =>
      cols.map((key) => (e[key] == null ? '' : e[key]))
    )
    return `    
      <table border="1">
        <tr>${cols.map((e) => `<th>${e}</th>`).join('')}</tr>
        ${vals.map((e) => `<tr>${e.map((v) => `<td>${e}</td>`)}</tr>`).join('')}
      </table>
    `
  }

  static img(url: string | ImgContent) {
    const obj = typeof url === 'string' ? { src: url } : url
    if (obj.width == null) {
      obj.width = '100%'
    }

    const attrs = Object.keys(obj)
      .map((key) => `${key}="${obj[key]}"`)
      .join(' ')

    console.log(`<img decoding="async" loading="lazy" ${attrs}>`)
  }
}

export const logger = Logger
