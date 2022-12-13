import {
  QueryPaginationInput,
  QueryResult,
  QueryResultEntity,
} from "../../interface";

export interface Location {
  id: string;
  name: string;
}
export interface FoodItemEntity {
  id: string;
  name?: string;
  dateEnd?: {
    seconds: number;
    nanoseconds: number;
  };
  location?: Location;
  status: string;
}

export interface FoodItemsQueryResultData extends QueryResult {
  items: FoodItemEntity[];
}

export interface FoodItemsQueryResult {
  foodItems: FoodItemsQueryResultData;
}

export interface FoodItemsQueryFilterInput {
  name?: string;
  dateEnd?: Date;
  locationId?: string;
}

export interface FoodItemsPaginationInput extends QueryPaginationInput {
  where?: FoodItemsQueryFilterInput[];
}

export interface LocationQueryResult {
  locations: Location[];
}

export enum FoodItemStatus {
  NEW = "NEW",
  EATEN = "EATEN",
}
