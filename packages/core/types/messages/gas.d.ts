export namespace gas {
    namespace MsgSend {
        namespace uosmo {
            const amount: number;
            const gas: string;
        }
        namespace uatom {
            const amount_1: number;
            export { amount_1 as amount };
            const gas_1: string;
            export { gas_1 as gas };
        }
    }
    namespace MsgTransfer {
        export namespace uosmo_1 {
            const amount_2: number;
            export { amount_2 as amount };
            const gas_2: string;
            export { gas_2 as gas };
        }
        export { uosmo_1 as uosmo };
        export namespace uatom_1 {
            const amount_3: number;
            export { amount_3 as amount };
            const gas_3: string;
            export { gas_3 as gas };
        }
        export { uatom_1 as uatom };
    }
}
