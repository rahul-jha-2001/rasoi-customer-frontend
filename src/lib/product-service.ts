import {apiFetch} from "./api-fetch";
import { GetCategoryRequest,ListCategoryRequest,GetProductRequest,ListProductsRequest,ListAddOnRequest,ListDietPrefRequest } from "./types";


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
