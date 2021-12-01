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
import { CollectionsService } from './collections.service';
import { AdminCollectionResponseDto } from './dto/admin-collection-res.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCollectionDto: CreateCollectionDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.create(
      createCollectionDto,
    );
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiResponse(res);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminCollectionResponseDto[]>> {
    const collections = await this.collectionsService.findAll();
    const res = collections.map(
      (collection) =>
        new AdminCollectionResponseDto(collection, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminCollectionResponseDto[]>> {
    const collections = await this.collectionsService.findAvailableCollection();
    const res = collections.map(
      (collection) =>
        new AdminCollectionResponseDto(collection, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.findOne(id);
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiResponse(res);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.update(
      id,
      updateCollectionDto,
    );
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiResponse(res, 'Update collection successful!');
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async remove(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.remove(id);
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiResponse(res);
  }
}
