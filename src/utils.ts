import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import { parse, extname, join } from 'path';
import { Equal, LessThan, MoreThan, Not } from 'typeorm';
import { v1 } from 'uuid';

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

export class ApiResponse<T> {
  constructor(data: T, message?: string, errorCode?: string) {
    this.code = errorCode;
    this.data = data;
    this.message = message;
  }

  code: string;
  data: T;
  message: string;
}

export function isNumeric(x) {
  return (typeof x === 'number' || typeof x === 'string') && !isNaN(Number(x));
}

const abcd: CondArrayType = [
  ['price', '=', 123],
  ['a.b.c', '>', 99],
];

type ConditionOperator = '>' | '<' | '=' | '!=';
type CondItemType = [string, ConditionOperator, any];
type CondJoinType = 'or';
export type CondArrayType = Array<CondItemType | CondJoinType>;
export type OrderArrayType = Array<[string, 'DESC' | 'ASC']>;

const queryFunctionsMapper: { [key in ConditionOperator]: Function } = {
  '>': MoreThan,
  '<': LessThan,
  '=': Equal,
  '!=': Not,
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

const generateCondFromArray = (conds: CondArrayType) => {
  return conds.reduce((prevCond, currentCond, index) => {
    const res: any = {};
    if (currentCond instanceof Array) {
      const [keyPath, cond, compareValue] = currentCond;
      const keys = keyPath.split('.');
      if (keys.length > 1) {
        gen(keys, compareValue, res, cond);
      } else {
        if (!queryFunctionsMapper[cond]) {
          throw new Error("Condition only support '>' | '<' | '=' | '!='");
        }

        if (cond === '!=') {
          res[keyPath] = queryFunctionsMapper[cond](Equal(compareValue));
        } else {
          res[keyPath] = queryFunctionsMapper[cond](compareValue);
        }
      }
    } else {
      if (currentCond != 'or') {
        throw new Error("Condition join operator only support 'or'");
      }
      res[currentCond] = true;
    }

    return { ...prevCond, ...res };
  }, {});
};

export const generateConditions = (
  conds: CondArrayType,
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

export const generateOrderFromObject = <T>(
  orderObj: OrderArrayType,
  defaultOrder: object,
) => {
  let res = {};
  orderObj.forEach(([key, value]) => {
    res = { ...res, [key]: value.toUpperCase() };
  });

  return { ...res, ...defaultOrder };
};
