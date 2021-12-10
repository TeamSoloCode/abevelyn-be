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
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { LanguageCode } from 'src/entity-enum';
import { ApiResponse } from 'src/utils';
import { ColorsService } from './colors.service';
import { AdminColorResponseDto } from './dto/admin-client-res.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createColorDto: CreateColorDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminColorResponseDto>> {
    const color = await this.colorsService.create(createColorDto);
    const result = new AdminColorResponseDto(color, headerInfo.language);
    return new ApiResponse(result);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminColorResponseDto[]>> {
    const colors = await this.colorsService.findAll();
    const res = colors.map(
      (color) => new AdminColorResponseDto(color, headerInfo.language),
    );

    return new ApiResponse(res);
  }

  @Get('/fetch_available')
  async findAvailable(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminColorResponseDto[]>> {
    const colors = await this.colorsService.findAvailable();
    const res = colors.map(
      (color) => new AdminColorResponseDto(color, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminColorResponseDto>> {
    const color = await this.colorsService.findOne(id);
    const result = new AdminColorResponseDto(color, headerInfo.language);
    return new ApiResponse(result);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminColorResponseDto>> {
    const color = await this.colorsService.update(id, updateColorDto);
    const result = new AdminColorResponseDto(color, headerInfo.language);
    return new ApiResponse(result);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async remove(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminColorResponseDto>> {
    const color = await this.colorsService.remove(id);
    const result = new AdminColorResponseDto(color, headerInfo.language);
    return new ApiResponse(result);
  }
}
