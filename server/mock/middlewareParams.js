export class ExpressRes {
  constructor() {
    this.body = null
    this.statusCode = null
  }

  status(code) {
    this.statusCode = code
    return this
  }

  json(body) {
    this.body = body
    return this
  }
}

export function expressNext(value) {
  return { next: true, value }
}
