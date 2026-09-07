export class ApiError<T = unknown> extends Error {
  status: number
  data: T | null

  constructor(status: number, message: string, data: T | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export class BadRequestError<T = unknown> extends ApiError<T> {
  constructor(message: string, data: T | null = null) {
    super(400, message, data)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError<T = unknown> extends ApiError<T> {
  constructor(message: string, data: T | null = null) {
    super(401, message, data)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError<T = unknown> extends ApiError<T> {
  constructor(message: string, data: T | null = null) {
    super(403, message, data)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError<T = unknown> extends ApiError<T> {
  constructor(message: string, data: T | null = null) {
    super(404, message, data)
    this.name = 'NotFoundError'
  }
}

export class UnprocessableEntityError<T = unknown> extends ApiError<T> {
  constructor(message: string, data: T | null = null) {
    super(422, message, data)
    this.name = 'UnprocessableEntityError'
  }
}

export class InternalServerError<T = unknown> extends ApiError<T> {
  constructor(message: string, data: T | null = null) {
    super(500, message, data)
    this.name = 'InternalServerError'
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(0, message)
    this.name = 'NetworkError'
  }
}

export class UnknownError extends ApiError {
  constructor(message: string) {
    super(500, message)
    this.name = 'UnknownError'
  }
}
