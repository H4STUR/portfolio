<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'from' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Mail::raw($validated['message'], function ($mail) use ($validated) {
            $mail->to(env('MAIL_TO_ADDRESS', 'your@email.com'))
                 ->from($validated['from'])
                 ->subject('Portfolio | ' .$validated['subject']);
        });

        return response()->json(['message' => 'Email sent successfully!']);
    }
}
