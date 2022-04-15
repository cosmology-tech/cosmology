export class RestClient {
    constructor({ url }: {
        url: any;
    });
    url: any;
    _clientType: string;
    instance: import("axios").AxiosInstance;
    request(endpoint: any, opts?: {}): Promise<any>;
}
