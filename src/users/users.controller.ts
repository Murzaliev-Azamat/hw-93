import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post()
  registerUser(@Req() req: Request) {
    const user = new this.userModel({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    });

    user.generateToken();

    return user.save();
  }

  @Post('sessions')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request) {
    return req.user as UserDocument;
  }

  @UseGuards(TokenAuthGuard)
  @Get('secret')
  async secret(@Req() req: Request) {
    return req.user;
  }
}