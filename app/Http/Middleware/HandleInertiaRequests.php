<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Cart;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cart = null;
        if ($request->user()) {
            $cart = Cart::where('user_id', $request->user()->id)
                ->with(['items.product.shop'])
                ->first();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart' => $cart ? [
                'items' => $cart->items->map(fn($item) => [
                    'id'       => $item->id,
                    'quantity' => $item->quantity,
                    'product'  => $item->product ? [
                        'id'    => $item->product->id,
                        'name'  => $item->product->name,
                        'price' => $item->product->price,
                        'image' => $item->product->image,
                        'slug'  => $item->product->slug,
                        'shop'  => $item->product->shop ? ['name' => $item->product->shop->name] : null,
                    ] : null,
                ])->values()->all(),
                'count' => $cart->items->sum('quantity'),
            ] : ['items' => [], 'count' => 0],
        ];
    }
}
