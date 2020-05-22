"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUSES = {
    latest: 'latest',
    active: 'active',
    waiting: 'waiting',
    completed: 'completed',
    failed: 'failed',
    delayed: 'delayed',
    paused: 'paused',
};
exports.FIELDS = {
    active: ['attempts', 'data', 'id', 'name', 'opts', 'progress', 'timestamps'],
    completed: [
        'attempts',
        'data',
        'id',
        'name',
        'opts',
        'progress',
        'timestamps',
    ],
    delayed: [
        'attempts',
        'data',
        'delay',
        'id',
        'name',
        'opts',
        'promote',
        'timestamps',
    ],
    failed: [
        'attempts',
        'failedReason',
        'data',
        'opts',
        'id',
        'name',
        'progress',
        'retry',
        'timestamps',
    ],
    latest: ['attempts', 'data', 'id', 'name', 'opts', 'progress', 'timestamps'],
    paused: ['attempts', 'data', 'id', 'name', 'opts', 'timestamps'],
    waiting: ['data', 'id', 'name', 'opts', 'timestamps'],
};
//# sourceMappingURL=constants.js.map