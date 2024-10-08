<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinesweeperScoreBoard extends Model
{
    use HasFactory;

    protected $fillable = ['player_name', 'score', 'difficulty', 'time'];
}
