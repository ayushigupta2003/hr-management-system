<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $auth = $this->authService->register($request->validated());

        return $this->successResponse('Registration completed successfully.', [
            'access_token' => $auth['access_token'],
            'token_type'   => $auth['token_type'],
            'expires_in'   => $auth['expires_in'],
            'user'         => (new UserResource($auth['user']))->resolve(),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $auth = $this->authService->login($request->validated());
        } catch (AuthenticationException $e) {
            return $this->errorResponse($e->getMessage(), null, 401);
        }

        return $this->successResponse('Login successful.', [
            'access_token' => $auth['access_token'],
            'token_type'   => $auth['token_type'],
            'expires_in'   => $auth['expires_in'],
            'user'         => (new UserResource($auth['user']))->resolve(),
        ]);
    }

    public function me(): JsonResponse
    {
        return $this->successResponse('Authenticated user fetched successfully.', [
            'user' => (new UserResource($this->authService->me()))->resolve(),
        ]);
    }

    public function refresh(): JsonResponse
    {
        $auth = $this->authService->refresh();

        return $this->successResponse('Token refreshed successfully.', [
            'access_token' => $auth['access_token'],
            'token_type'   => $auth['token_type'],
            'expires_in'   => $auth['expires_in'],
            'user'         => (new UserResource($auth['user']))->resolve(),
        ]);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return $this->successResponse('Logout successful.');
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->authService->updateProfile($request->validated());

        return $this->successResponse('Profile updated successfully.', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword($request->validated('password'));

        return $this->successResponse('Password changed successfully.');
    }
}
