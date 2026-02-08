export interface Location {
  cityName: string;
  townName: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Property {
  name: string;
  value: string;
}

export interface CarListing {
  id: number;
  title: string;
  location: Location;
  category: Category;
  modelName: string;
  price: number;
  priceFormatted: string;
  date: string;
  dateFormatted: string;
  photo: string;
  properties: Property[];
}

export interface ListingParams {
  categoryId?: number;
  minDate?: string;
  maxDate?: string;
  minYear?: number;
  maxYear?: number;
  sort?: SortField;
  sortDirection?: SortDirection;
  skip?: number;
  take?: number;
}

export enum SortField {
  Price = 0,
  Date = 1,
  Year = 2,
}

export enum SortDirection {
  Ascending = 0,
  Descending = 1,
}

export interface UserInfo {
  id: number;
  nameSurname: string;
  phone: string;
  phoneFormatted: string;
}

export interface CarDetail {
  id: number;
  title: string;
  location: Location;
  category: Category;
  modelName: string;
  price: number;
  priceFormatted: string;
  date: string;
  dateFormatted: string;
  photos: string[];
  properties: Property[];
  text: string;
  userInfo: UserInfo;
}

export interface FilterParams {
  minDate?: string;
  maxDate?: string;
  minYear?: number;
  maxYear?: number;
}

export interface URLFilterParams {
  pageSize?: number;
}
