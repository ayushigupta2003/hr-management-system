<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboard
    ) {}

    public function __invoke(): JsonResponse
    {
        return $this->successResponse('Dashboard stats fetched successfully.', $this->dashboard->stats());
    }
}
