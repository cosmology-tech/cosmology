import { osmoRestClientOnly } from "../utils";

export default async (argv) => {
    const client = await osmoRestClientOnly(argv);
    const result = await client.getLatestBlock();
    console.log(result);
};
