import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { CreateTracksDto } from './create-tracks.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}
  @Get()
  async getAll(@Query() query) {
    if (query) {
      return this.trackModel.find({ album: query.album });
    }
    return this.trackModel.find();
  }
  @Post()
  @UseGuards(TokenAuthGuard)
  async createTrack(@Body() trackData: CreateTracksDto) {
    const track = new this.trackModel({
      album: trackData.album,
      name: trackData.name,
      time: trackData.time,
      trackNumber: trackData.trackNumber,
      linkToYoutube: trackData.linkToYoutube,
    });
    return track.save();
  }
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    const track = await this.trackModel.findOne({ _id: id });
    if (track) {
      await this.trackModel.deleteOne({ _id: track._id });
    }
    return { message: 'Album deleted' };
  }
}
