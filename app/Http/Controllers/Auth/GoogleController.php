<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Client;

class GoogleController extends Controller
{
    /**
     * Redirect the user to Google's OAuth page.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google after authentication.
     * Uses verify => false to bypass SSL issues on local Windows/XAMPP dev environment.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new Client(['verify' => false]))
                ->stateless()
                ->user();
        } catch (\Exception $e) {
            Log::error('Google OAuth failed: ' . $e->getMessage());
            return redirect()->route('login')
                ->withErrors(['google' => 'Google login failed: ' . $e->getMessage()]);
        }

        // Find or create the user
        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'              => $googleUser->getName(),
                'password'          => bcrypt(Str::random(32)),
                'email_verified_at' => now(),
            ]
        );

        Auth::login($user, true);
        request()->session()->regenerate();

        // Redirect based on role
        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->hasRole('vendor')) {
            return redirect()->route('vendor.dashboard');
        }

        return redirect()->route('dashboard');
    }
}
