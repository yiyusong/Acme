import { SetMetadata } from '@nestjs/common';

export const DON_NEED_TOKEN = 'DON_NEED_TOKEN';

export const NoToken = () => SetMetadata(DON_NEED_TOKEN, true);
