<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Or specify which methods are allowed

    'allowed_origins' => ['*'], // Or restrict to specific origins

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Or specify which headers are allowed

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
