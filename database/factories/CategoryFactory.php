<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->randomElement(['Ceramics', 'Woodwork', 'Textiles', 'Jewelry', 'Leather Goods']);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
        ];
    }
}