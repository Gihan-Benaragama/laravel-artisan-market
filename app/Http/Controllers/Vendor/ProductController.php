<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    private function vendorShop()
    {
        return Auth::user()->vendor->shop;
    }

    public function index()
    {
        $products = $this->vendorShop()->products()->with('category')->latest()->get();

        return Inertia::render('Vendor/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Vendor/Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,avif,bmp,tiff,heic,heif|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $validated['shop_id'] = $this->vendorShop()->id;
        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        Product::create($validated);

        return redirect()->route('vendor.products.index')->with('success', 'Product created.');
    }

    public function edit(Product $product)
    {
        // security: make sure this product belongs to the logged-in vendor's shop
        if ($product->shop_id !== $this->vendorShop()->id) {
            abort(403);
        }

        return Inertia::render('Vendor/Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->shop_id !== $this->vendorShop()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,avif,bmp,tiff,heic,heif|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()->route('vendor.products.index')->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        if ($product->shop_id !== $this->vendorShop()->id) {
            abort(403);
        }

        // 1. Remove from all shopping carts
        CartItem::where('product_id', $product->id)->delete();

        // 2. Delete reviews on this product
        Review::where('product_id', $product->id)->delete();

        // 3. Delete any product variants
        $product->variants()->delete();

        // 4. Remove stored image (skip placeholder/external URLs)
        if ($product->image && !str_starts_with($product->image, 'http')) {
            Storage::disk('public')->delete($product->image);
        }

        // sub_order_items.product_id is now nullable (nullOnDelete)
        // so those rows are automatically nullified by the DB when we delete.
        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }
}