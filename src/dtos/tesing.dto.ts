import { IsEmail, IsEnum, IsMobilePhone, IsString } from 'class-validator';

export class Testing {
  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;

  @IsString()
  public fullname!: string;

  @IsEnum(['male', 'female'], {
    message: 'Gender must be male or female',
  })
  public gender!: string;

  @IsMobilePhone()
  public mobile!: number;
}
