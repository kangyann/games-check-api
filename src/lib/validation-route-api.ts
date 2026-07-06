export default class ValidationRouteApi {
  private ParameterValue: string;
  private contentTypeValue: string;
  private apiKeyValue: string;

  constructor(params: string, contentType: string, apikey: string) {
    this.ParameterValue = params;
    this.contentTypeValue = contentType;
    this.apiKeyValue = apikey;
  }

  public checking() {
    if (!this.ParameterValue) {
      return {
        message: "400 - Missing {type} query.",
        status: 400,
      };
    }
    if (!this.contentTypeValue || !this.contentTypeValue.includes("application/json")) {
      return {
        message: "400 - Content-Type must be application/json.",
        status: 400,
      };
    }
    if (!this.apiKeyValue) {
      return {
        message: "401 - Missing API Key. Provide 'x-api-key' header.",
        status: 401,
      };
    }

    return {
      message: "200 - Validation passed.",
      status: 200,
    };
  }
}
