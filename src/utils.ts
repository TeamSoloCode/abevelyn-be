import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import { parse, extname, join } from 'path';
import { Equal, In, LessThan, MoreThan, Not } from 'typeorm';
import { v1 } from 'uuid';
import { ColorDataResponseDto } from './colors/dto/color-data-res.dto';
import { UserDataResponse } from './users/dto/user-data-response.dto';
import { ProductDataResponseDto } from './products/dto/product-data-res.dto';
import { MaterialResponseDto } from './materials/dto/material-data-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { MatchStoredTokenGuard } from './auth/guards/match-token.guard';
import { CartDataResponse } from './carts/dto/cart-data-response.dto';
import { CartItemDataResponseDTO } from './cart-item/dto/cart-item-data-response.dto';
import { OrderDataResponseDTO } from './orders/dto/order-response.dto';
import { SaleResponseDto } from './sales/dto/sale-response.dto';
import { IConfig } from './config/configuration';
import { ApiProperty } from '@nestjs/swagger';

export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const ENV_PATH_NAME = 'env';
export const AuthGuards = [MatchStoredTokenGuard, AuthGuard()];

export const DTOKeyPrototypeMapper = {
  color: ColorDataResponseDto.prototype,
  user: UserDataResponse.prototype,
  product: ProductDataResponseDto.prototype,
  material: MaterialResponseDto.prototype,
  cart: CartDataResponse.prototype,
  cartItem: CartItemDataResponseDTO.prototype,
  order: OrderDataResponseDTO.prototype,
  sale: SaleResponseDto.prototype,
};

export let _envConstants: IConfig | undefined = undefined;
export function setEnvConstants(env: IConfig) {
  _envConstants = env;
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file,
  callback,
  category: string,
) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${category}_${Date.now()}_${v1()}${fileExtName}`);
};

export const deleteUnusedImage = (
  deletedFile: string,
  callback?: () => void,
) => {
  const filePath = join(process.cwd(), `/uploads/${deletedFile}`);
  if (!existsSync(filePath)) {
    unlink(filePath, callback);
  }
};

export class CalculatePriceInfo {
  totalPrice?: number;
  totalSaleOffAsCurrency?: number;
  totalSaleOffAsPercentage?: number;
  calculatedPrice?: number;
}

export class ApiDataResponse<T> {
  constructor(data: T, message?: string, errorCode?: string) {
    this.code = errorCode;
    this.data = data;
    this.message = message;
  }

  @ApiProperty()
  code: string;

  @ApiProperty()
  data: T;

  @ApiProperty()
  count?: number;

  @ApiProperty()
  message: string;
}

export function isNumeric(x) {
  return (typeof x === 'number' || typeof x === 'string') && !isNaN(Number(x));
}

type ConditionOperator = '>' | '<' | '=' | '!=' | 'in';
type ConditionItemType = [string, ConditionOperator, any];
type CondJoinType = 'or' | 'in' | 'OR' | 'IN';
export type ConditionArrayType = Array<ConditionItemType | CondJoinType>;
export type OrderArrayType = Array<[string, 'DESC' | 'ASC']>;

const queryFunctionsMapper: { [key in ConditionOperator]: Function } = {
  '>': MoreThan,
  '<': LessThan,
  '=': Equal,
  '!=': Not,
  in: In,
};

const gen = (
  keyPath: string[],
  value: any,
  res: any,
  cond: ConditionOperator,
) => {
  if (keyPath[1]) {
    res[keyPath[0]] = {};
    const newKeyPath = [...keyPath];
    newKeyPath.shift();
    gen(newKeyPath, value, res[keyPath[0]], cond);
  } else {
    if (!queryFunctionsMapper[cond]) {
      throw new Error("Condition only support '>' | '<' | '=' | '!='");
    }

    if (cond === '!=') {
      res[keyPath[0]] = queryFunctionsMapper[cond](Equal(value));
    } else {
      res[keyPath[0]] = queryFunctionsMapper[cond](value);
    }
  }
};

const generateCondFromArray = (conds: ConditionArrayType) => {
  return conds.reduce((prevCond, currentCond, index) => {
    const res: any = {};
    if (currentCond instanceof Array) {
      const [keyPath, cond, compareValue] = currentCond;
      const keys = keyPath.split('.');
      if (keys.length > 1) {
        gen(keys, compareValue, res, cond);
      } else {
        if (!queryFunctionsMapper[cond]) {
          throw new Error(
            "Condition only support '>' | '<' | '=' | '!=' | 'in'",
          );
        }

        if (cond === '!=') {
          res[keyPath] = queryFunctionsMapper[cond](Equal(compareValue));
        } else {
          res[keyPath] = queryFunctionsMapper[cond](compareValue);
        }
      }
    } else {
      if (currentCond != 'OR') {
        throw new Error("Condition join operator only support 'or'");
      }
      res[currentCond] = true;
    }

    return { ...prevCond, ...res };
  }, {});
};

export const generateConditions = (
  conds: ConditionArrayType,
  defaultCondition: object = {},
) => {
  const conditionAsObject = generateCondFromArray(conds);

  const res = [{}];
  let conditionCount = 0;
  Object.entries(conditionAsObject).forEach(([key, value]) => {
    if (key === 'or' && value === true) {
      conditionCount++;
    } else {
      res[conditionCount] = {
        ...res[conditionCount],
        ...{ [key]: value },
        ...defaultCondition,
      };
    }
  });

  return res;
};

export const generateOrderFromObject = <T>(orderObj: OrderArrayType) => {
  let res = {};
  orderObj.forEach(([key, value]) => {
    res = { ...res, [key]: value.toUpperCase() };
  });

  return res;
};

function computeConditions(
  cond: ConditionItemType | ConditionArrayType | string,
) {
  if (typeof cond === 'string') {
    switch (cond.toLocaleLowerCase()) {
      case 'or':
        return ' OR ';
      default:
        throw `Join operator ${cond} is not supported`;
    }
  } else if (
    cond instanceof Array &&
    cond.length === 3 &&
    typeof cond[0] === 'string'
  ) {
    const [field, operator, value] = cond;
    let sqlValue = value;
    let sqlOperator = operator;

    if (typeof sqlValue == 'string') {
      sqlValue = ` '${sqlValue}' `;
    }

    switch (operator) {
      case 'in':
        sqlOperator = 'IN';
        if (!(sqlValue instanceof Array)) {
          throw "'in' operator need a value as an array";
        } else {
          const updatedValue = sqlValue.map((value) => {
            if (typeof value == 'string') {
              return `'${value}'`;
            }
            return value;
          });
          sqlValue = `( ${updatedValue} )`;
        }
        break;
      case '=':
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '!=':
        break;
      default:
        throw `Operator ${sqlOperator} is not supported`;
    }

    return ` ${field} ${sqlOperator} ${sqlValue} `;
  } else if (
    cond instanceof Array &&
    cond[0] instanceof Array &&
    cond[0].length === 3
  ) {
    const condLength = cond[0].length;
    let res = '';
    cond.forEach((childCond, index) => {
      if (
        typeof childCond !== 'string' &&
        index > 0 &&
        index <= condLength - 1
      ) {
        res += ' AND ';
      }
      res += computeConditions(childCond);
    });
    return '( ' + res + ' )';
  } else {
    throw 'Invalid conditions query';
  }
}

export const generateConditionToSQLQuery = (conds: ConditionArrayType) => {
  let where = '';

  conds.forEach((cond, index) => {
    if (index == 0 && !(cond instanceof Array) && cond?.length !== 3) {
      throw 'Conditions have to begin with an array with 3 items';
    }
    if (typeof cond !== 'string' && index > 0 && index < cond.length - 1) {
      where += ' AND ';
    }
    where += computeConditions(cond);
  });

  return where;
};

export const generateOrderToSQLQuery = (
  orders: OrderArrayType,
): OrderArrayType => {
  return orders.map(([field, orderBy]) => {
    let order: 'ASC' | 'DESC' = 'ASC';
    switch (orderBy.toLocaleLowerCase()) {
      case 'asc':
        order = 'ASC';
        break;
      case 'desc':
        order = 'DESC';
        break;
      default:
        throw `Orderby ${orderBy} is not supported`;
    }

    return [field, order];
  });
};
