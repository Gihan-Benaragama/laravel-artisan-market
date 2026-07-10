<?php

namespace Database\Factories;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShopFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'vendor_id' => Vendor::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(100, 999),
            'description' => fake()->sentence(12),
            'logo' => null,
            'banner' => null,
        ];
    }
}