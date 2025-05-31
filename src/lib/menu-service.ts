import productService from "./product-service";
import {
  Category,
  DietaryPreference,
  ListCategoryResponse,
  ListProductsResponse,
  ListDietPrefResponse,
} from "./product-service"; // adjust based on your file structure

export interface MenuData {
  categories: Category[];
  products: ListProductsResponse["products"];
  dietaryPreferences: DietaryPreference[];
}

async function getMenuData(storeUuid: string, token: string): Promise<MenuData> {
    const [categoriesRes, productsRes, dietPrefsRes] = await Promise.all([
    productService.listCategories({ storeUuid, limit: 100, page: 1 }, token),
    productService.listAllProducts(storeUuid, 500, 1, token),
    productService.listDietPrefs({ storeUuid, limit: 100, page: 1 }, token),
  ]);

  return {
    categories: categoriesRes.categories,
    products: productsRes.products,
    dietaryPreferences: dietPrefsRes.dietaryPreferences,
  };
}
export default getMenuData;
