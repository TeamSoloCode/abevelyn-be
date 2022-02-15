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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { FetchDataQueryValidationPipe } from 'src/auth/pipes/fetch-data-query.pipe';
import { LanguageCode } from 'src/common/entity-enum';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { ApiDataResponse, AuthGuards } from 'src/utils';
import { CollectionsService } from './collections.service';
import { AdminCollectionResponseDto } from './dto/admin-collection-res.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCollectionDto: CreateCollectionDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.create(
      createCollectionDto,
    );
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiDataResponse(res);
  }

  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<ApiDataResponse<AdminCollectionResponseDto[]>> {
    const collections = await this.collectionsService.findAll(query);
    const res = collections.map(
      (collection) =>
        new AdminCollectionResponseDto(collection, headerInfo.language),
    );
    return new ApiDataResponse(res);
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<ApiDataResponse<AdminCollectionResponseDto[]>> {
    const collections = await this.collectionsService.findAvailableCollection(
      query,
    );
    const res = collections.map(
      (collection) =>
        new AdminCollectionResponseDto(collection, headerInfo.language),
    );
    return new ApiDataResponse(res);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.findOne(id);
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiDataResponse(res);
  }

  @Patch('/:id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminCollectionResponseDto>> {
    const collection = await this.collectionsService.update(
      id,
      updateCollectionDto,
    );
    const res = new AdminCollectionResponseDto(collection, headerInfo.language);
    return new ApiDataResponse(res, 'Update collection successful!');
  }
}
