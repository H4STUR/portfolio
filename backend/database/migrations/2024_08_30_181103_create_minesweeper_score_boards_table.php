<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMinesweeperScoreBoardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('minesweeper_score_boards', function (Blueprint $table) {
            $table->id();
            $table->string('player_name');
            $table->integer('score');
            $table->enum('difficulty', ['Easy', 'Medium', 'Hard']);
            $table->integer('time'); // Time taken to complete the game
            $table->timestamps(); // Created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('minesweeper_score_boards');
    }
}
