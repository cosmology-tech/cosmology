export declare class RestClient {
    url: string;
    _clientType: string;
    instance: any;
    constructor({ url }: {
        url: any;
    });
    request(endpoint: any, opts?: {}): Promise<unknown>;
}
