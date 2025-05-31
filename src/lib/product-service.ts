import { makeCacheKey, saveCache, getCache, invalidatePrefix,invalidateCache } from "./rediscache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function makeAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const CACHE_TTL = 60 * 5; // 5 minutes in seconds

// ====== Shared Fetcher ======
async function apiFetch<T>(
  path: string,
  method: string,
  token: string,
  body?: any,
  useCache = true,
  identifiers: { userUuid?: string; storeUuid?: string } = {}
): Promise<T> {
  const isGET = method === "GET";
  const cacheKey = makeCacheKey(path, identifiers);
  console.log("🔍 using cache key:", cacheKey, "useCache:", useCache, "isGET:", isGET);

  if (isGET && useCache) {
    const cached = await getCache<T>(cacheKey); // ⬅️ await here
    console.log(`[CACHE ${cached ? "HIT" : "MISS"}] ${cacheKey}`);
    if (cached) return cached;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: makeAuthHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  if (isGET && useCache) {
    await saveCache(cacheKey, data, CACHE_TTL); // ⬅️ correct function & TTL
  }

  return data;
}

export {
  apiFetch,
  makeAuthHeaders,
  makeCacheKey,
  invalidateCache,
};


export enum ProductStatus {
  PRODUCT_STATE_DRAFT = 0,
  PRODUCT_STATE_ACTIVE = 1,
  PRODUCT_STATE_INACTIVE = 2,
  PRODUCT_STATE_OUT_OF_STOCK = 3,
}

export interface Category {
  categoryUuid: string;
  storeUuid: string;
  name: string;
  description: string;
  displayOrder: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  storeUuid: string;
  name: string;
  description: string;
  displayOrder: number;
  isAvailable: boolean;
  isActive: boolean;
}

export interface GetCategoryRequest {
  storeUuid: string;
  categoryUuid: string;
}



export interface ListCategoryRequest {
  storeUuid: string;
  page: number;
  limit: number;
}


export interface DietaryPreference {
  storeUuid: string;
  dietPrefUuid: string;
  name: string;
  description: string;
  iconUrl: string;
}


export interface AddOn {
  addOnUuid: string;
  name: string;
  isAvailable: boolean;
  maxSelectable: number;
  GSTPercentage: number;
  price: number;
  productUuid: string;
  createdAt: string;
  updatedAt: string;
  isFree: boolean;
}


export interface ListAddOnRequest {
  storeUuid: string;
  productUuid: string;
  page: number;
  limit: number;
}

export interface Product {
  productUuid: string;
  storeUuid: string;
  name: string;
  description: string;
  status: ProductStatus;
  isAvailable: boolean;
  displayPrice: number;
  price: number;
  GSTPercentage: number;
  category: Category;
  dietaryPref: DietaryPreference[];
  imageURL: string;
  imageBytes?: string;
  addOns: AddOn[];
  createdAt: string;
  updatedAt: string;
  packagingCost: number;
}


export interface GetProductRequest {
  productUuid: string;
  storeUuid: string;
  categoryUuid: string;
  isActive?: boolean;
  isAvailable?: boolean;
}


export interface ListProductsRequest {
  storeUuid: string;
  categoryUuid: string;
  page: number;
  limit: number;
}

export interface CategoryResponse {
  category: Category;
}

export interface ProductResponse {
  product: Product;
}

export interface AddOnResponse {
  addOn: AddOn;
}

export interface DietPrefResponse {
  dietaryPreference: DietaryPreference;
}

export interface ListCategoryResponse {
  categories: Category[];
  prevPage: number;
  nextPage: number;
}

export interface ListProductsResponse {
  products: Product[];
  prevPage: number;
  nextPage: number;
}

export interface ListAddOnResponse {
  addOns: AddOn[];
  nextPage: number;
  prevPage: number;
}
export interface ListDietPrefRequest {
  storeUuid: string;
  limit: number;
  page: number;
}
export interface ListDietPrefResponse {
  dietaryPreferences: DietaryPreference[];
  nextPage: number;
  prevPage: number;
}

const productService = {


  getCategory: async (data: GetCategoryRequest, token: string|null) =>
    await apiFetch(`/v1/store/${data.storeUuid}/category/${data.categoryUuid}`, "GET", token, undefined, true, { storeUuid: data.storeUuid }),

  listCategories: async (data: ListCategoryRequest, token: string) =>
    await apiFetch(`/v1/store/${data.storeUuid}/category/list?limit=${data.limit}&page=${data.page}`, "GET", token, undefined, true, { storeUuid: data.storeUuid }),

  getProduct: async (data: GetProductRequest, token: string) =>
    await apiFetch(`/v1/store/${data.storeUuid}/category/${data.categoryUuid}/product/${data.productUuid}`, "GET", token, undefined, true, { storeUuid: data.storeUuid }),

  getProductById: async (storeUuid: string, productUuid: string, token: string) =>
    await apiFetch(`/v1/store/${storeUuid}/product/${productUuid}`, "GET", token, undefined, true, { storeUuid }),

  listProductsByCategory: async (data: ListProductsRequest, token: string) =>
    await apiFetch(`/v1/store/${data.storeUuid}/category/${data.categoryUuid}/product/list?limit=${data.limit}&page=${data.page}`, "GET", token, undefined, true, { storeUuid: data.storeUuid }),

  listAllProducts: async (storeUuid: string, limit: number, page: number, token: string) =>
    await apiFetch(`/v1/store/${storeUuid}/product/list?limit=${limit}&page=${page}`, "GET", token, undefined, true, { storeUuid }),

  getAddOn: async (storeUuid: string, productUuid: string, addOnUuid: string, token: string) =>
    await apiFetch(`/v1/store/${storeUuid}/product/${productUuid}/add_on/${addOnUuid}`, "GET", token, undefined, true, { storeUuid }),

  listAddOns: async (data: ListAddOnRequest, token: string) =>
    await apiFetch(`/v1/store/${data.storeUuid}/product/${data.productUuid}/add_on/list?limit=${data.limit}&page=${data.page}`, "GET", token, undefined, true, { storeUuid: data.storeUuid }),

  getDietPref: async (storeUuid: string, token: string) =>
    await apiFetch(`/v1/store/${storeUuid}/dietpref`, "GET", token, undefined, true, { storeUuid }),

  listDietPrefs: async (data: ListDietPrefRequest, token: string) =>
    await apiFetch(`/v1/store/${data.storeUuid}/dietpref/list?limit=${data.limit}&page=${data.page}`, "GET", token, undefined, true, { storeUuid: data.storeUuid }),
};

export default productService;
