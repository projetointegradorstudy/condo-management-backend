import { User } from 'src/users/entities/user.entity';

export interface JwtPayload {
  user: User;
}
