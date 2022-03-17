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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { FetchDataQueryValidationPipe } from '../auth/pipes/fetch-data-query.pipe';
import { FetchDataQuery } from '../common/fetch-data-query';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuards, editFileName, imageFileFilter } from '../utils';
import { CollectionsService } from './collections.service';
import { CollectionResponseDto } from './dto/collection-data-res.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { MultipartTransformPipe } from './pipes/dto-collection-transform';
import { diskStorage, Express } from 'multer';
import { ResponseMessageInterceptor } from '../common/interceptors/response-message.interceptor';

@Controller('collections')
@UseInterceptors(new ApiResponseInterceptor())
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(
    new ResponseMessageInterceptor<CollectionResponseDto>({
      201: (data) => {
        return `Create Collection '${data.name}' successful!`;
      },
    }),
    new ResponseDataInterceptor(new CollectionResponseDto()),
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          editFileName(req, file, callback, 'collection');
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body(MultipartTransformPipe, ValidationPipe)
    createCollectionDto: CreateCollectionDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Collection> {
    return this.collectionsService.create({
      ...createCollectionDto,
      image: image?.filename || createCollectionDto.image,
    });
  }

  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new CollectionResponseDto()))
  async findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<Collection[]> {
    return this.collectionsService.findAll(query);
  }

  @Get('/fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new CollectionResponseDto()))
  async findAvailableCollection(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<Collection[]> {
    return this.collectionsService.findAvailableCollection(query);
  }

  @Get('/:id')
  @UseInterceptors(new ResponseDataInterceptor(new CollectionResponseDto()))
  async findOne(@Param('id') id: string): Promise<Collection> {
    return this.collectionsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  // @UsePipes(MultipartTransformPipe, ValidationPipe)
  @UseInterceptors(
    new ResponseMessageInterceptor<CollectionResponseDto>({
      200: (data) => {
        return `Update Collection '${data.name}' successful!`;
      },
    }),
    new ResponseDataInterceptor(new CollectionResponseDto()),
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          editFileName(req, file, callback, 'collection');
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @Param('id') id: string,
    @Body(MultipartTransformPipe, ValidationPipe)
    updateCollectionDto: UpdateCollectionDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Collection> {
    return this.collectionsService.update(id, {
      ...updateCollectionDto,
      image: image?.filename || updateCollectionDto.image,
    });
  }
}
