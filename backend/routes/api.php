<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('residents', ResidentController::class);
    Route::apiResource('houses', HouseController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('expenses', ExpenseController::class);

    Route::get('reports/summary', [ReportController::class, 'summary']);
    Route::get('reports/detail', [ReportController::class, 'detail']);
    Route::get('reports/dashboard-stats', [ReportController::class, 'dashboardStats']);
});
