<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MinesweeperController;

Route::middleware('api')->group(function () {
    Route::get('/scores', [MinesweeperController::class, 'getScores']);
    Route::post('/scores', [MinesweeperController::class, 'saveScore']);
});