import { Express } from 'express';
import { mount } from './routes';
import controllers from './controllers'

const promController = controllers.get("prometheus:metrics:scrap")!;

const mountRoutes = (app: Express) => {
    //mount prometheus route to scrap metrics
    app.get('/metrics', promController.handler());

    //mount other routes
    mount(app);
}

export { mountRoutes };
