import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductStatusService } from './product-status.service';
import { CreateProductStatusDto } from './dto/create-product-status.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { ApiDataResponse } from 'src/utils';
import { AdminProductStatusResponseDto } from './dto/admin-product-status-res.dto';
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';

@Controller('product_status')
export class ProductStatusController {
  constructor(private readonly productStatusService: ProductStatusService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createProductStatusDto: CreateProductStatusDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.create(
      createProductStatusDto,
    );
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiDataResponse(res);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminProductStatusResponseDto[]>> {
    const productStatus = await this.productStatusService.findAll();
    const res = productStatus.map(
      (status) =>
        new AdminProductStatusResponseDto(status, headerInfo.language),
    );
    return new ApiDataResponse(res);
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiDataResponse<AdminProductStatusResponseDto[]>> {
    const productStatus = await this.productStatusService.findAvailable();
    const res = productStatus.map(
      (status) =>
        new AdminProductStatusResponseDto(status, headerInfo.language),
    );
    return new ApiDataResponse(res);
  }

  @Get('/:id')
  async findOne(
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Param('id') id: string,
  ): Promise<ApiDataResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.findOne(id);
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiDataResponse(res);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
  ): Promise<ApiDataResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.update(
      id,
      updateProductStatusDto,
    );
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiDataResponse(res);
  }
}
