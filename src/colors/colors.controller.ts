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
import { GetLanguageOnHeader } from 'src/auth/decorators/get-language.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { LanguageCode } from 'src/entity-enum';
import { ApiResponse } from 'src/utils';
import { ColorsService } from './colors.service';
import { ColorClientResponseDto } from './dto/color-client-res.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  async findAll(
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<ApiResponse<ColorClientResponseDto[]>> {
    const colors = await this.colorsService.findAll();
    const res = colors.map(
      (color) => new ColorClientResponseDto(color, language),
    );

    return new ApiResponse(res);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  remove(@Param('id') id: string) {
    return this.colorsService.remove(id);
  }
}
