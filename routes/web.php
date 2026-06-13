<?php

use App\Http\Controllers\ContactInquiryController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Redirect::route('landing.show', ['locale' => 'en']))->name('home');

Route::post('/{locale}/contact', [ContactInquiryController::class, 'store'])
    ->middleware('throttle:contact-inquiry')
    ->whereIn('locale', ['en', 'uk'])
    ->name('contact.store');

Route::get('/{locale}', function (string $locale) {
    App::setLocale($locale);

    return Inertia::render('Welcome', [
        'locale' => $locale,
    ]);
})
    ->whereIn('locale', ['en', 'uk'])
    ->name('landing.show');
