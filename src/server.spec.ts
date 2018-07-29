import 'jasmine';
import Axios, { AxiosInstance } from 'axios';

import { TesterMixerServer } from './helpers/server.helpers';
import { MixerServer, ServerLifecycle } from './server';

describe('Mixer Server', () => {
    it('errors out when no implementation is given', () => {
        expect(() => new MixerServer(null)).toThrowError();
    });

    describe('Tester Mixer Server', async () => {
        let mixerServer = null;
        let lifecycle: ServerLifecycle;
        let axiosInstance: AxiosInstance = null;
        beforeAll(async () => {
            mixerServer = new MixerServer(new TesterMixerServer());
            axiosInstance = Axios.create({
                baseURL: `http://localhost:${mixerServer.port}`
            });
            lifecycle = mixerServer.initMixerServer();
            await lifecycle.startServer();
        });

        it('calls get handlers', async () => {
            let response = await axiosInstance.get('/testGet1');
            expect(response.data).toBe('ran get handler for testGet1');
        });

        it('calls post handlers', async () => {
            let response = await axiosInstance.post('/testPost1');
            expect(response.data).toBe('ran post handler for testPost1');
        });

        afterAll(() => {
            lifecycle.killServer();
        });
    });
});
