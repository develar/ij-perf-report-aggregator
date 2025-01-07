import { ServerConfigurator } from "../dataQuery"

interface PerformanceBisectRequest {
  targetValue: string
  changes: string
  direction: string
  test: string
  metric: string
  branch: string
  buildType: string
  className: string
}

interface ErrorBisectRequest {
  changes: string
  test: string
  branch: string
  buildType: string
  className: string
}

export class BisectClient {
  private readonly serverConfigurator: ServerConfigurator | null

  constructor(serverConfigurator: ServerConfigurator | null) {
    this.serverConfigurator = serverConfigurator
  }

  async sendBisectRequest(request: PerformanceBisectRequest | ErrorBisectRequest): Promise<string> {
    const url = `${this.serverConfigurator?.serverUrl}/api/meta/teamcity/startBisect`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Failed to send bisect request: ${response.statusText} ${errorMessage}`)
    }
    return response.text()
  }
}
