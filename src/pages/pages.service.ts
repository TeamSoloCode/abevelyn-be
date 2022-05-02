import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { CommonService } from 'src/common/common-services.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageRepository } from './repositories/page.repository';

@Injectable()
export class PagesService extends CommonService<PageRepository> {
  create(createPageDto: CreatePageDto) {
    return 'This action adds a new page';
  }

  testGetPageByPath(path: string) {
    if (path == 'core') {
      const code = fs.readFileSync(
        join(process.cwd(), `./test_page/test_core.code.js`),
        'utf8',
      );

      return { code };
    }
    const code = fs.readFileSync(
      join(process.cwd(), `./test_page/test_page.code.js`),
      'utf8',
    );
    const layout = fs.readFileSync(
      join(process.cwd(), './test_page/test_page.layout.json'),
      'utf8',
    );

    return { code, layout };
  }

  update(id: number, updatePageDto: UpdatePageDto) {
    return `This action updates a #${id} page`;
  }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
