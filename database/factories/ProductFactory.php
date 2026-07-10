<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'shop_id' => Shop::factory(),
            'category_id' => Category::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 20, 300),
            'stock' => fake()->numberBetween(0, 50),
            'image' => null,
        ];
    }
}