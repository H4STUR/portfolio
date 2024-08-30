<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MinesweeperScoreBoard;


class MinesweeperController extends Controller
{
    // Method to fetch all scores from the MinesweeperScoreBoard
    public function getScores()
{
    // Fetch and group scores by player name and difficulty, selecting the best time
    $scores = MinesweeperScoreBoard::select('player_name', 'difficulty', DB::raw('MIN(time) as time'))
        ->groupBy('player_name', 'difficulty')
        ->orderBy('difficulty')
        ->orderBy('time')
        ->get();

    // Group scores by difficulty and limit to top 10 scores
    $groupedScores = [
        'Easy' => [],
        'Medium' => [],
        'Hard' => []
    ];

    foreach ($scores as $score) {
        $groupedScores[$score->difficulty][] = $score;
    }

    // Limit each difficulty level to the top 10 scores
    foreach ($groupedScores as $difficulty => $group) {
        $groupedScores[$difficulty] = collect($group)->sortBy('time')->take(10)->values()->all();
    }

    return response()->json($groupedScores);
}


    // Method to save a new score to the MinesweeperScoreBoard
    public function saveScore(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'player_name' => 'required|string|max:50',
            'score' => 'required|integer',
            'difficulty' => 'required|in:Easy,Medium,Hard',
            'time' => 'required|integer', // Ensure time is submitted in seconds or appropriate format
        ]);

        try {
            // Create a new score entry in the database
            MinesweeperScoreBoard::create([
                'player_name' => $request->player_name,
                'score' => $request->score,
                'difficulty' => $request->difficulty,
                'time' => $request->time,
            ]);

            return response()->json(['message' => 'Score saved successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error saving score', 'error' => $e->getMessage()], 500);
        }
    }
}
