import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AuthGuard } from '@nestjs/passport';
import { MatchStoredTokenGuard } from 'src/auth/guards/match-token.guard';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';

@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Post()
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Get()
  findAll() {
    return this.sizesService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.sizesService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizesService.update(id, updateSizeDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  remove(@Param('id') id: string) {
    return this.sizesService.remove(id);
  }
}
