"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Queue_1 = require("./Queue");
const RedisStats_1 = require("./RedisStats");
const Header_1 = require("./Header");
const useStore_1 = require("./hooks/useStore");
exports.App = ({ basePath }) => {
    var _a, _b;
    const { state, selectedStatuses, setSelectedStatuses, promoteJob, retryJob, retryAll, cleanAllDelayed, cleanAllFailed, cleanAllCompleted, } = useStore_1.useStore(basePath);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Header_1.Header, null),
        react_1.default.createElement("main", null, state.loading ? ('Loading...') : (react_1.default.createElement(react_1.default.Fragment, null,
            ((_a = state.data) === null || _a === void 0 ? void 0 : _a.stats) ? (react_1.default.createElement(RedisStats_1.RedisStats, { stats: state.data.stats })) : (react_1.default.createElement(react_1.default.Fragment, null, "No stats to display ")), (_b = state.data) === null || _b === void 0 ? void 0 :
            _b.queues.map(queue => (react_1.default.createElement(Queue_1.Queue, { queue: queue, key: queue.name, selectedStatus: selectedStatuses[queue.name], selectStatus: setSelectedStatuses, promoteJob: promoteJob(queue.name), retryJob: retryJob(queue.name), retryAll: retryAll(queue.name), cleanAllDelayed: cleanAllDelayed(queue.name), cleanAllFailed: cleanAllFailed(queue.name), cleanAllCompleted: cleanAllCompleted(queue.name) }))))))));
};
//# sourceMappingURL=App.js.map