import { Admin } from '@/interface/admin.interface';
import AdminSchema from '@/models/admin.model';
import TokenService from '@/services/token.service';
import { ApiMessage } from '@/utils/messages';
import { compare, genSalt, hash } from 'bcrypt';
import createHttpError from 'http-errors';
class AuthService {
  tokenService = new TokenService();

  public async adminLogin(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password } = body;
        if (Object.keys(body).length == 0) throw new createHttpError.NotAcceptable(ApiMessage.emptybody);
        const user = await AdminSchema.findOne({ email: email }).select('-__v');
        if (!user) throw new createHttpError.NotAcceptable(ApiMessage.usernotfound);
        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new createHttpError.NotAcceptable(ApiMessage.passwordnotvalid);
        let accessToken = await this.tokenService.signAccessToken(user._id, 'admin');
        resolve({ user: user, tokens: { accessToken: accessToken } });
      } catch (error) {
        reject(error);
      }
    });
  }
  public async adminSignup(body: Admin) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(body).length == 0) throw new createHttpError.NotAcceptable(ApiMessage.emptybody);
        const { email, password } = body;
        const userExist = await AdminSchema.findOne({ email: email }).select('-__v');
        if (userExist) throw new createHttpError.NotAcceptable(ApiMessage.alreadyexist);
        const salt = await genSalt(12);
        const hashedPassword = await hash(password, salt);
        body['password'] = hashedPassword;
        await AdminSchema.validate(body);
        const result = await AdminSchema.create(body);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  
}

export default AuthService;
