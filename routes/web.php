<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\IssueController;

Auth::routes();
Route::middleware('auth')->group(function () {

    Route::get('/', function () {
        return redirect('/home');
    });
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::resource('permissions', PermissionController::class);
    Route::resource('users', UserController::class);
    Route::resource('categories', CategoryController::class);
    Route::post('issues/{issue}/comments', [IssueController::class, 'addComment'])->name('issues.addComment');
    Route::get('issues/monitor/overdue', [IssueController::class, 'monitorOverdueIssues'])->name('issues.monitorOverdue');
    Route::resource('issues', IssueController::class);
});
