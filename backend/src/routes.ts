import { Application } from 'express';
import { Container, initializeControllers } from './container/Container';
import { IconController } from './controllers/IconController';
import { LikeController } from './controllers/LikeController';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { isLoggedIn } from './middlewares/isLoggedIn';

export function routes(app: Application): void {
  initializeControllers();
  postRoutes(app);
  likeRoutes(app);
  userRoutes(app);
  iconRoutes(app);
}

function postRoutes(app: Application): void {
  const postController = Container.resolveController<PostController>('postController');

  app.get('/api/posts', isLoggedIn, postController.getPosts.bind(postController));
  app.get('/api/posts/:owner', isLoggedIn, postController.getOwnerPosts.bind(postController));
  app.post('/api/posts', isLoggedIn, postController.postPost.bind(postController));
  app.put('/api/posts/:postid', isLoggedIn, postController.updatePost.bind(postController));
  app.delete('/api/posts/:postid', isLoggedIn, postController.deletePost.bind(postController));
}

function likeRoutes(app: Application): void {
  const likeController = Container.resolveController<LikeController>('likeController');

  app.post('/api/likes', isLoggedIn, likeController.likePost.bind(likeController));
  app.delete('/api/likes/:postid', isLoggedIn, likeController.unlikePost.bind(likeController));
}

function userRoutes(app: Application): void {
  const userController = Container.resolveController<UserController>('userController');

  app.get('/api/profiles/:owner', isLoggedIn, userController.getProfile.bind(userController));
  app.put('/api/profiles', isLoggedIn, userController.updateProfile.bind(userController));
}

function iconRoutes(app: Application): void {
  const iconController = Container.resolveController<IconController>('iconController');

  app.get('/api/icons/:owner', isLoggedIn, iconController.getIcon.bind(iconController));
  app.put('/api/icons', isLoggedIn, iconController.updateIcon.bind(iconController));
}
