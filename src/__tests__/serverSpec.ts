import server from '../server.js';
import request from 'supertest';
describe('test server index is working fine', () => {
    it('server is running', async () => {
        const res = await request(server).get('/');
        expect(res.statusCode).toBe(200);
    });
    it('any unknown endpoint must respond with 404 not found', async () => {
        const res = await request(server).get('/anythingnotendpoint');
        expect(res.text).toEqual('404 NOT FOUND');
        expect(res.statusCode).toBe(404);
    });
});
