import { Request } from 'express';
import { User } from 'src/modules/user/models/user.model';
export class AuthRequest extends Request {
  user: User;
}
