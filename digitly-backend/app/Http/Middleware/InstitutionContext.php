<?php

namespace App\Http\Middleware;

use App\Models\Institution;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InstitutionContext
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $institutionId = $request->route('id') ?? $request->route('institution');

        $user = $request->user();

        if (!$user || !Institution::find($institutionId)->hasMember($user->id)) {
            return response()->json([
                'message' => 'Доступ запрещен. Вы не являетесь участником этой организации.'
            ], 403);
        }

        return $next($request);

    }
}
