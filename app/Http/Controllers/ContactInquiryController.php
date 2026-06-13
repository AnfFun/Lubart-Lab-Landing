<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactInquiryRequest;
use App\Mail\ContactInquiryReceived;
use App\Models\ContactInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactInquiryController extends Controller
{
    public function store(StoreContactInquiryRequest $request, string $locale): RedirectResponse
    {
        $inquiry = ContactInquiry::create($request->inquiryData());
        $recipient = config('services.contact.inquiry_to');

        if (is_string($recipient) && $recipient !== '') {
            try {
                Mail::to($recipient)->send(new ContactInquiryReceived($inquiry));
            } catch (Throwable $throwable) {
                Log::warning('Contact inquiry notification could not be queued.', [
                    'contact_inquiry_id' => $inquiry->id,
                    'exception' => $throwable::class,
                    'message' => $throwable->getMessage(),
                ]);
            }
        } else {
            Log::notice('Contact inquiry saved without notification recipient.', [
                'contact_inquiry_id' => $inquiry->id,
            ]);
        }

        return redirect()
            ->route('landing.show', ['locale' => $locale])
            ->with('contact.submitted', true);
    }
}
