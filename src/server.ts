import * as express from 'express';
import { Request, Express } from 'express'
import { Server } from 'http';
import { json as jsonBodyParser } from 'body-parser';

export interface ServerLifecycle {
    startServer(): void;
    killServer(): void;
}

class Handler<T> {
    constructor(
        private _name: string,
        private _handler: T) {
    }

    get name(): string {
        return this._name;
    }

    get handler(): T {
        return this._handler;
    }
}

interface GetHandlerType {
    (): Promise<any>;
}
export class GetHandler extends Handler<GetHandlerType> {
}

interface PostHandlerType {
    (req: Request): Promise<any>;
}
export class PostHandler extends Handler<PostHandlerType> {
}

export class MixerServer {
    private _app: Express = null;
    private _expressServerInstance: Server = null;

    constructor(
        private _serverImpl: IMixerServerImpl,
        private _port: number = 4200) {

        if (!_serverImpl) {
            throw new Error("No Mixer server implementation given!");
        }
    }

    public initMixerServer(): ServerLifecycle {
        this._app = express();
        this._serverImpl.initExpressServer(this._app);

        for (let getHandler of this._serverImpl.initGetHandlers()) {
            this._app.get(`/${getHandler.name}`, async (req, res) => {
                res.send(await getHandler.handler());
            });
        }

        for (let postHandler of this._serverImpl.initPostHandlers()) {
            this._app.post(`/${postHandler.name}`, async (req, res) => {
                res.send(await postHandler.handler(req))
            });
        }

        return {
            startServer: () => {
                return new Promise((resolve) => {
                    this._expressServerInstance = this._app.listen(
                        this._port,
                        () => {
                            console.log(`Mixer server listening on port ${this._port}!`);
                            resolve();
                        });
                });
            },

            killServer: () => {
                this._expressServerInstance.close();
            }
        };
    }

    get port(): number {
        return this._port;
    }
}

export interface IMixerServerImpl {
    initGetHandlers(): GetHandler[];
    initPostHandlers(): PostHandler[];
    initExpressServer(app: Express): void;
}
