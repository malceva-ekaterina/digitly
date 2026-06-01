<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Resources\CartItemResource;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Models\ShoppingCart;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CartController extends Controller
{
    /**
     * Summary of addItem
     * @param AddToCartRequest $request
     * @return \Illuminate\Http\JsonResponse
     * POST /api/v1/cart/items 
     */
    public function addItem(AddToCartRequest $request)
    {
        $user = $request->user();

        $cart = ShoppingCart::firstOrCreate(
            ['user_id' => $user->id],
            ['currency' => 'RUB']
        );

        $modelClass = Relation::getMorphedModel($request->product_type);
        $product = $modelClass::find($request->product_id);
        
        $existingItem = CartItem::checkItem($cart->id, $request->product_type, $request->product_id, $request->version_id)->first();
        
        if ($existingItem) {
            return response()->json([
                'success' => false,
                'message' => 'Товар уже добавлен в корзину',
            ], Response::HTTP_CONFLICT);
        }
               
        CartItem::create([
            'shopping_cart_id' => $cart->id,
            'product_type'     => $request->product_type,
            'product_id'       => $product->id,
            'version_id'       => $product->version_id,
            'unit_price_minor' => $product->price_minor
        ]);

        return response()->json(['message' => 'Item added successfully']);


    }

// DELETE /api/v1/cart/items/{itemId} — удаление из корзины
    public function deleteItem(Request $request, $itemId)
    {
        $user = $request->user();
        $cartId = $user->cart->id;

        $cartItem = CartItem::where('shopping_cart_id', $cartId)
            ->where('id', $itemId)
            ->first();
        if (!$cartItem) {
            return false;
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Товар удалён из корзины',
        ]);

    }

    public function showCart(Request $request)
    {
        $user = $request->user();
        
       $cart = ShoppingCart::with('items.product')
            ->firstOrCreate(
                ['user_id' => $user->id],
                ['currency' => 'RUB']
            );
        
        return new CartResource($cart);
    }

// GET /api/v1/cart — текущая корзинаВозврат: список товаров, общая сумма

// Расчёт: SUM(items.price_minor)
}
