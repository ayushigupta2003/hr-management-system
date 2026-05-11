<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users
    ) {
    }

    public function register(array $payload): array
    {
        $user = $this->users->create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => $payload['password'],
            'role' => UserRole::Employee,
            'status' => UserStatus::Active,
            'phone' => $payload['phone'] ?? null,
            'job_title' => $payload['job_title'] ?? null,
        ]);

        return $this->tokenPayload(Auth::login($user), $user);
    }

    public function login(array $credentials): array
    {
        if (! $token = Auth::attempt($credentials)) {
            throw new AuthenticationException('Invalid email or password.');
        }

        /** @var User $user */
        $user = Auth::user();

        if ($user->status !== UserStatus::Active) {
            Auth::logout();
            throw new AuthenticationException('This account is inactive.');
        }

        return $this->tokenPayload($token, $user);
    }

    public function me(): User
    {
        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    public function refresh(): array
    {
        /** @var User $user */
        $user = Auth::user();

        return $this->tokenPayload(Auth::refresh(), $user);
    }

    public function logout(): void
    {
        Auth::logout();
    }

    public function updateProfile(array $payload): User
    {
        /** @var User $user */
        $user = Auth::user();
        $user->update([
            'name'      => $payload['name'],
            'email'     => $payload['email'],
            'phone'     => $payload['phone']     ?? null,
            'job_title' => $payload['job_title'] ?? null,
        ]);

        return $user->fresh();
    }

    public function changePassword(string $newPassword): void
    {
        /** @var User $user */
        $user = Auth::user();
        $user->update(['password' => $newPassword]);
    }

    private function tokenPayload(string $token, User $user): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            'user' => $user,
        ];
    }
}
