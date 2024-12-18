import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async equal(key: string, value: string): Promise<boolean> {
    const result = await this.redisClient.get(key);
    return result === value;
  }
}
