<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->count(4)->create();
        \App\Models\Todolist::factory()->count(7)->create();
        \App\Models\Todo::factory()->count(30)->create();
    }
}
