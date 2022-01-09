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
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';
import { AdminSizeResponseDto } from './dto/admin-size-res.dto';
import { ApiDataResponse } from 'src/utils';

@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createSizeDto: CreateSizeDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminSizeResponseDto>> {
    const size = await this.sizesService.create(createSizeDto);
    const res = new AdminSizeResponseDto(size, headerInfo.language);
    return new ApiDataResponse(res);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminSizeResponseDto[]>> {
    const sizes = await this.sizesService.findAll();
    const res = sizes.map(
      (size) => new AdminSizeResponseDto(size, headerInfo.language),
    );
    return new ApiDataResponse(res);
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminSizeResponseDto[]>> {
    const sizes = await this.sizesService.findAvailable();
    const res = sizes.map(
      (size) => new AdminSizeResponseDto(size, headerInfo.language),
    );
    return new ApiDataResponse(res);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminSizeResponseDto>> {
    const size = await this.sizesService.findOne(id);
    const res = new AdminSizeResponseDto(size, headerInfo.language);
    return new ApiDataResponse(res);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateSizeDto: UpdateSizeDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminSizeResponseDto>> {
    const size = await this.sizesService.update(id, updateSizeDto);
    const res = new AdminSizeResponseDto(size, headerInfo.language);
    return new ApiDataResponse(res, 'Update successful!');
  }
}
