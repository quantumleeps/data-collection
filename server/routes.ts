import * as express from 'express';

import CatCtrl from './controllers/cat';
import LocationCtrl from './controllers/location';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import Location from './models/location';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const locationCtrl = new LocationCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Locations
  router.route('/locations').get(locationCtrl.getAll);
  router.route('/locations/count').get(locationCtrl.count);
  router.route('/location').post(locationCtrl.insert);
  router.route('/location/:id').get(locationCtrl.get);
  router.route('/location/:id').put(locationCtrl.update);
  router.route('/location/:id').delete(locationCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
