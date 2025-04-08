<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MinesweeperController;
use App\Http\Controllers\EmailController;


Route::middleware('api')->group(function () {
    Route::get('/scores', [MinesweeperController::class, 'getScores']);
    Route::post('/scores', [MinesweeperController::class, 'saveScore']);

    //email
    Route::post('/contact', [EmailController::class, 'send']);
});