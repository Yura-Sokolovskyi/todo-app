<?php

use App\Http\Controllers\TodoController;
use App\Http\Controllers\TodoListController;
use Illuminate\Support\Facades\Route;



Route::get('/', function () {
    return view('auth.login');
});

Route::get('/', [TodolistController::class, 'getUserTodolist'])
    ->middleware(['auth'])->name('todo-app');



Route::get('/todo/{id}', [TodoController::class, 'todosByTodoList'])
    ->middleware(['auth']);

Route::post('/todo', [TodoController::class, 'store'])
    ->middleware(['auth']);

Route::patch('/todo/{id}', [TodoController::class, 'edit'])
    ->middleware(['auth']);

Route::put('/todo', [TodoController::class, 'update'])
    ->middleware(['auth']);

Route::delete('/todo/{id}', [TodoController::class, 'destroy'])
    ->middleware(['auth']);



Route::post('/todo-list', [TodoListController::class, 'store'])
    ->middleware(['auth']);

Route::delete('/todo-list/{id}', [TodoListController::class, 'destroy'])
    ->middleware(['auth']);




require __DIR__.'/auth.php';
