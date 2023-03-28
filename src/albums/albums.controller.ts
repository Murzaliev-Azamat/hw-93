import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/albums.schema';
import { CreateAlbumDto } from './create-albums.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}
  @Get()
  async getAll(@Query() query) {
    console.log(query.artist);
    if (query) {
      return this.albumModel.find({ artist: query.artist });
    }
    return this.albumModel.find();
  }
  @Get(':id')
  async getOneAlbum(@Param('id') id: string) {
    return this.albumModel.find({ _id: id });
  }
  @Post()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/albums' }),
  )
  async createAlbum(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      artist: albumData.artist,
      name: albumData.name,
      year: albumData.year,
      image: file ? '/uploads/albums/' + file.filename : null,
    });
    return album.save();
  }
  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    const album = await this.albumModel.findOne({ _id: id });
    if (album) {
      await this.albumModel.deleteOne({ _id: album._id });
      await this.trackModel.deleteMany({ album: album._id });
    }
    return { message: 'Album deleted' };
  }
}
