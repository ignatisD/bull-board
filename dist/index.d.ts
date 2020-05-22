import { Queue } from 'bull';
declare const router: import("express-serve-static-core").Express;
export declare const setQueues: (bullQueues: readonly Queue<any>[]) => void;
export declare const replaceQueues: (bullQueues: readonly Queue<any>[]) => void;
export { router };
