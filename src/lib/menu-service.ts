import productService from "./product-service";
import {
  Category,
  ListCategoryResponse,
  ListDietPrefResponse,
  DietaryPreference,
  ListProductsResponse,
} from "./types"; // adjust based on your file structure

export interface MenuData {
  categories: Category[];
  products: ListProductsResponse["products"];
  dietaryPreferences: DietaryPreference[];
}

async function getMenuData(storeUuid: string, token: string|null): Promise<MenuData> {
    const [categoriesRes, productsRes, dietPrefsRes]: [ListCategoryResponse, ListProductsResponse, ListDietPrefResponse] = await Promise.all([
    productService.listCategories({ storeUuid, limit: 100, page: 1 }, token) as Promise<ListCategoryResponse>,
    productService.listAllProducts(storeUuid, 500, 1, token) as Promise<ListProductsResponse>,
    productService.listDietPrefs({ storeUuid, limit: 100, page: 1 }, token) as Promise<ListDietPrefResponse>,
  ]);

  return {
    categories: categoriesRes.categories,
    products: productsRes.products,
    dietaryPreferences: dietPrefsRes.dietaryPreferences,
  };
}
export default getMenuData;
