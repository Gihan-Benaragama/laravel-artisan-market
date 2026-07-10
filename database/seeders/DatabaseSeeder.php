<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 5 fixed categories, not random duplicates
        $categories = collect(['Ceramics', 'Woodwork', 'Textiles', 'Jewelry', 'Leather Goods'])
            ->map(fn ($name) => Category::create([
                'name' => $name,
                'slug' => \Illuminate\Support\Str::slug($name),
            ]));

        // 5 vendors, each with one shop
        Vendor::factory(5)
            ->has(Shop::factory())
            ->create()
            ->each(function ($vendor) use ($categories) {
                // each vendor's shop gets 4-6 products
                Product::factory(rand(4, 6))->create([
                    'shop_id' => $vendor->shop->id,
                    'category_id' => $categories->random()->id,
                ]);
            });
    }
}