import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { MatchStoredTokenGuard } from 'src/auth/guards/match-token.guard';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  remove(@Param('id') id: string) {
    return this.colorsService.remove(id);
  }
}
