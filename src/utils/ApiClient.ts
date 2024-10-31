export class ApiClient {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const query = params
      ? '?' + new URLSearchParams(params).toString()
      : '';

    const response = await fetch(`${this.baseURL}${url}${query}`, {
      headers: {
        'Accept-Encoding': 'gzip',
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }
}
