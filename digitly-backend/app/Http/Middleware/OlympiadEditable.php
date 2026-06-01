<?php

namespace App\Http\Middleware;

use App\Models\Olympiad;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OlympiadEditable
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $olympiadId = $request->route('olympiad') ?? $request->route('id');
        $user = $request->user();
        $olympiad = Olympiad::find($olympiadId);
        
        $olympiad->institution->isAdmin($user);
        
        if ($olympiad->accessGrants()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Изменения запрещены, олимпиада уже продана',
            ], Response::HTTP_FORBIDDEN);
        }
        return $next($request);
    }
}
