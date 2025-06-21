import { FindManyOptions } from 'typeorm';
import { BaseService } from './BaseService';
import { PostDto } from '../dtos/PostDto';
import { Post, PostType } from '../entities/Post';
import { User } from '../entities/User';
import { AuthorizationError } from '../errors/AuthorizationError';
import { ValidationError } from '../errors/ValidationError';
import { PostRepository, DEFAULT_LIST_LIMIT, DEFAULT_LIST_OFFSET } from '../repositories/PostRepository';
import { IconService } from './IconService';

export class PostService extends BaseService<
  { postRepository: typeof PostRepository; },
  { iconService: IconService; }
> {
  constructor (postRepository: typeof PostRepository, iconService: IconService) {
    super({ postRepository }, { iconService });
  }

  async findPosts(
    loggedInUserId: number,
    username: string,
    offset?: number,
    limit?: number,
  ): Promise<PostDto[]> {
    const options: FindManyOptions<Post> = {
      select: {
        id: true,
        content: true,
        type: true,
        posted_at: true,
        user: { id: true, username: true },
        users: { id: true },
      },
      relations:{
        user: true,
        users: true,
      },
      order: {
        posted_at: 'DESC',
      },
      skip: offset || DEFAULT_LIST_OFFSET,
      take: limit || DEFAULT_LIST_LIMIT,
    };

    if (username) {
      options.where = {
        user: { username },
      };
    }

    const posts = await this.repos.postRepository.find(options);

    return this.toDtos(posts, loggedInUserId);
  }

  async createPost(
    content: string,
    user: User,
  ): Promise<PostDto> {
    const post = new Post();
    post.content = content;
    post.type = PostType.POST;
    post.user = user;
    post.users = [];

    await this.repos.postRepository.save(post);
    return this.toDto(post);
  }

  async updatePost(
    postid: number,
    content: string,
    user: User,
  ): Promise<PostDto> {
    // if not found, throw EntityNotFoundError
    const post = await this.repos.postRepository.findOneOrFail({
      relations:{ 
        user: true,
        users: true,
      },
      where: { id: postid },
    });

    if (!post.canBeUpdatedBy(user.id)) {
      throw new AuthorizationError(`User:${user.username} cannot update Post:${post.id}.`);
    }

    post.content = content;

    await this.repos.postRepository.save(post);
    return this.toDto(post, user.id);
  }

  async deletePost(
    postid: number,
    user: User,
  ): Promise<void> {
    // if not found, throw EntityNotFoundError
    const post = await this.repos.postRepository.findOneOrFail({
      relations:{ user: true },
      where: { id: postid },
    });

    if (!post.canBeDeletedBy(user.id)) {
      throw new AuthorizationError(`User:${user.username} cannot delete Post:${post.id}.`);
    }

    await this.repos.postRepository.remove(post);
  }

  async likePost(
    postid: number,
    user: User,
  ): Promise<number> {
    // if not found, throw EntityNotFoundError
    const post = await this.repos.postRepository.findOneOrFail({
      relations: { users: true },
      where: { id: postid },
    });

    let hasLiked = false;
    for (const owner of post.users) {
      if (owner.id === user.id) {
        hasLiked = true;
        break;
      }
    }

    if (hasLiked) {
      throw new ValidationError(`User:${user.username} has already liked Post:${post.id}.`);
    }

    post.users.push(user);
    await this.repos.postRepository.save(post);

    return post.users.length;
  }

  async unlikePost(
    postid: number,
    user: User,
  ): Promise<number> {
    // if not found, throw EntityNotFoundError
    const post = await this.repos.postRepository.findOneOrFail({
      relations: { users: true },
      where: { id: postid },
    });

    let hasLiked = false;
    post.users = post.users.filter(owner => {
      if (owner.id === user.id) hasLiked = true;
      return owner.id !== user.id;
    });

    if (!hasLiked) {
      throw new ValidationError(`User:${user.username} has not liked Post:${post.id}.`);
    }

    await this.repos.postRepository.save(post);

    return post.users.length;
  }

  private async toDtos(posts: Post[], loggedInUserId?: number): Promise<PostDto[]> {
    const dtos = posts.map(async post => {
      return await this.toDto(post, loggedInUserId);
    });

    return Promise.all(dtos);
  }

  private async toDto(post: Post, loggedInUserId?: number): Promise<PostDto> {
    return {
      id: post.id,
      type: post.type,
      content: post.content,
      user: {
        username: post.user.username,
        iconImage: await this.services.iconService.getIcon(post.user.username),
      },
      postedAt: post.posted_at,
      likeCount: post.users.length,
      isLiked: loggedInUserId ? post.users.some((u) => u.id === loggedInUserId) : false,
    };
  }
}
