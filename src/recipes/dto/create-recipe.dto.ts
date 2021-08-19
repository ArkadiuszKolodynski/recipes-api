export class CreateRecipeDto {
  title: string;
  ingredients: string[];
  directions: string[];
  imageUrl?: string | null;
}
