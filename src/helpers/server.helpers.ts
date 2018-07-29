import { IMixerServerImpl, GetHandler, PostHandler } from "../server";
import { Express, Request } from 'express'

export class TesterMixerServer implements IMixerServerImpl {
    initGetHandlers(): GetHandler[] {
        return [
            new GetHandler(
                "testGet1",
                () => {
                    return Promise.resolve("ran get handler for testGet1")
                }
            )
        ];
    }

    initPostHandlers(): PostHandler[] {
        return [
            new PostHandler(
                "testPost1",
                (req: Request) => {
                    return Promise.resolve("ran post handler for testPost1")
                }
            )
        ];
    }

    initExpressServer(app: Express) {
    }
}
