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
import { CollectionsService } from './collections.service';
import { CollectionResponseDto } from './dto/collection-client-response.dto';
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
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<CollectionResponseDto> {
    const collection = await this.collectionsService.create(
      createCollectionDto,
    );
    const res = new CollectionResponseDto(collection, language);
    return res;
  }

  @Get()
  async findAll(
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<CollectionResponseDto[]> {
    const collections = await this.collectionsService.findAll();
    const res = collections.map(
      (collection) => new CollectionResponseDto(collection, language),
    );
    return res;
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<ApiResponse<CollectionResponseDto[]>> {
    const collections = await this.collectionsService.findAvailableCollection();
    const res = collections.map(
      (collection) => new CollectionResponseDto(collection, language),
    );
    return new ApiResponse(res);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<ApiResponse<CollectionResponseDto>> {
    const collection = await this.collectionsService.findOne(id);
    const res = new CollectionResponseDto(collection, language);
    return new ApiResponse(res);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<ApiResponse<CollectionResponseDto>> {
    const collection = await this.collectionsService.update(
      id,
      updateCollectionDto,
    );
    const res = new CollectionResponseDto(collection, language);
    return new ApiResponse(res);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async remove(
    @Param('id') id: string,
    @GetLanguageOnHeader() language: LanguageCode,
  ): Promise<ApiResponse<CollectionResponseDto>> {
    const collection = await this.collectionsService.remove(id);
    const res = new CollectionResponseDto(collection, language);
    return new ApiResponse(res);
  }
}
