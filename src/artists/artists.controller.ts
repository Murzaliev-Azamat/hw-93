import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artists.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Album, AlbumDocument } from '../schemas/albums.schema';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RoleAuthGuard } from '../auth/role-auth.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}
  @Get()
  async getAll() {
    return this.artistModel.find();
  }
  @Get(':id')
  async getOneArtist(@Param('id') id: string) {
    return this.artistModel.find({ _id: id });
  }
  @Post()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists' }),
  )
  async createArtist(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistData: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      name: artistData.name,
      info: artistData.info,
      image: file ? '/uploads/artists/' + file.filename : null,
    });
    return artist.save();
  }
  @Delete(':id')
  @UseGuards(TokenAuthGuard, new RoleAuthGuard(['admin']))
  async deleteArtist(@Param('id') id: string) {
    const artist = await this.artistModel.findOne({ _id: id });
    if (artist) {
      const albums = await this.albumModel.find({ artist: artist._id });
      await this.artistModel.deleteOne({ _id: artist._id });
      await this.albumModel.deleteMany({ artist: artist._id });
      if (albums) {
        for (const album of albums) {
          await this.trackModel.deleteMany({ album: album._id });
        }
      }
    }
    return { message: 'Artist deleted' };
  }
}
