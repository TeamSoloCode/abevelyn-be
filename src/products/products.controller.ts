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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { ApiDataResponse, AuthGuards } from '../utils';
import { Product } from './entities/product.entity';
import { ProductDataResponseDto } from './dto/product-data-res.dto';
import { diskStorage, Express } from 'multer';
import { join } from 'path';
import { deleteUnusedImage, editFileName, imageFileFilter } from '../utils';

import {
  GetHeaderInfo,
  HeaderInfo,
} from '../auth/decorators/get-language.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FetchDataQuery } from '../common/fetch-data-query';
import { FetchDataQueryValidationPipe } from '../auth/pipes/fetch-data-query.pipe';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { ResponseMessageInterceptor } from '../common/interceptors/response-message.interceptor';

@ApiTags('Products APIs')
@Controller('products')
@UseInterceptors(new ApiResponseInterceptor())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(
    new ResponseMessageInterceptor<ProductDataResponseDto>({
      201: (data) => {
        return `Create Product '${data.name}' successful!`;
      },
    }),
    new ResponseDataInterceptor(new ProductDataResponseDto()),
  )
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          editFileName(req, file, callback, 'product');
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Product> {
    return this.productsService.create({
      ...createProductDto,
      image: image.filename,
    });
  }

  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ProductDataResponseDto()))
  async findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<Product[]> {
    return this.productsService.findAllProduct(query);
  }

  @Get('/fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new ProductDataResponseDto()))
  async findAvailable(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<Product[]> {
    return this.productsService.findAvailableProduct(query);
  }

  @Get('/:id')
  @UseInterceptors(new ResponseDataInterceptor(new ProductDataResponseDto()))
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(
    new ResponseMessageInterceptor<ProductDataResponseDto>({
      200: (data) => {
        return `Update Product '${data.name}' successful!`;
      },
    }),
    new ResponseDataInterceptor(new ProductDataResponseDto()),
  )
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            editFileName(req, file, callback, 'product');
          },
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
      image3?: Express.Multer.File[];
      image4?: Express.Multer.File[];
      image5?: Express.Multer.File[];
    },
  ): Promise<Product> {
    return this.productsService.update(id, {
      ...updateProductDto,
      image: files.image?.[0]?.filename,
      image1: files.image1?.[0]?.filename,
      image2: files.image2?.[0]?.filename,
      image3: files.image3?.[0]?.filename,
      image4: files.image4?.[0]?.filename,
      image5: files.image5?.[0]?.filename,
    });
  }
}
