"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app_1 = __importDefault(require("./src/app"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Use body-parser middleware to handle JSON requests.
app.use(body_parser_1.default.json());
// Mount the supply chain API routes under a prefix (e.g., /api)
app.use(app_1.default);
app.listen(port, () => {
    console.log(`Supply Chain API server listening on port ${port}`);
});
