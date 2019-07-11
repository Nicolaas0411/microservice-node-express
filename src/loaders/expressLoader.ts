import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { env } from '../env';
import * as path from 'path';
import * as fs from 'fs';
import deepEqual from 'deep-equal';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        // const connection = settings.getData('connection');

        /**
         * We create a new express server instance.
         * We could have also use useExpressServer here to attach controllers to an existing express instance.
         */
        const expressApp: Application = createExpressServer({
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
            /**
             * We can add options about how routing-controllers should configure itself.
             * Here we specify what controllers should be registered in our express server.
             */
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            interceptors: env.app.dirs.interceptors,

            /**
             * Authorization features
             */
            // authorizationChecker: authorizationChecker(connection),
            // currentUserChecker: currentUserChecker(connection),
        });

        // Run application to listen on given port
        if (!env.isTest) {
            const server = expressApp.listen(env.app.port);
            settings.setData('express_server', server);
        }

        // Here we can set the data for other loaders
        settings.setData('express_app', expressApp);

        const routingControllersOptions = {
            controllers: env.app.dirs.controllers,
        };

        // Parse routing-controllers classes into OpenAPI spec:
        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(storage, routingControllersOptions, {
            info: {
                title: 'SQN Microservice Boilerplate',
                description: 'Microservice boilerplate.',
                version: '1.0',
            },
        });

        const swaggerFile = path.join(__dirname, '..', env.swagger.file);
        const swaggerFileObject = JSON.stringify(require(path.join(__dirname, '..', env.swagger.file)));
        const newSpec = JSON.stringify(spec);
        if (!deepEqual(swaggerFileObject, newSpec)) {
            fs.writeFile(swaggerFile, newSpec, 'utf8', (err) => {
                if (err) {
                    console.error('ERROR: ' + err);
                    return;
                }
                console.log('File has been created: ' + swaggerFile);
            });
        }
    }
};
