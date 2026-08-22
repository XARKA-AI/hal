export type ApiRequest = {
  method?: string
  headers: Record<string, string | undefined>
  body?: unknown
}

export type ApiResponse = {
  setHeader(name: string, value: string): void
  status(code: number): ApiResponse
  json(payload: unknown): void
  end(payload?: unknown): void
}
