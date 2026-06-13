<?php

namespace Tests\Feature;

use App\Mail\ContactInquiryReceived;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ContactInquiryTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_home_redirects_to_english_landing(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/en');
    }

    public function test_landing_pages_render_for_supported_languages(): void
    {
        $this->get('/en')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
                ->component('Welcome')
                ->where('locale', 'en')
                ->etc());

        $this->get('/uk')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
                ->component('Welcome')
                ->where('locale', 'uk')
                ->etc());
    }

    public function test_unsupported_locale_is_not_found(): void
    {
        $this->get('/de')->assertNotFound();
        $this->post('/de/contact', $this->validPayload())->assertNotFound();
    }

    public function test_valid_contact_inquiry_is_saved_and_notification_is_queued(): void
    {
        Mail::fake();
        config(['services.contact.inquiry_to' => 'hello@lubartlab.test']);

        $response = $this->from('/en')->post('/en/contact', $this->validPayload([
            'email' => 'founder@example.test',
            'company' => 'Acme Studio',
        ]));

        $response->assertRedirect('/en');
        $response->assertSessionHas('contact.submitted', true);

        $this->assertDatabaseHas('contact_inquiries', [
            'locale' => 'en',
            'name' => 'Max Founder',
            'email' => 'founder@example.test',
            'company' => 'Acme Studio',
        ]);

        Mail::assertQueued(ContactInquiryReceived::class, function (ContactInquiryReceived $mail): bool {
            return $mail->inquiry->email === 'founder@example.test'
                && $mail->inquiry->locale === 'en';
        });
    }

    public function test_contact_inquiry_requires_valid_input(): void
    {
        Mail::fake();

        $response = $this->from('/en')->post('/en/contact', [
            'name' => '',
            'email' => 'not-an-email',
            'company' => str_repeat('A', 141),
            'message' => 'Too short',
        ]);

        $response->assertRedirect('/en');
        $response->assertSessionHasErrors(['name', 'email', 'company', 'message']);

        $this->assertDatabaseCount('contact_inquiries', 0);
        Mail::assertNothingQueued();
    }

    public function test_contact_inquiry_rejects_honeypot_submissions(): void
    {
        Mail::fake();

        $response = $this->from('/uk')->post('/uk/contact', $this->validPayload([
            'website' => 'https://spam.example',
        ]));

        $response->assertRedirect('/uk');
        $response->assertSessionHasErrors(['website']);

        $this->assertDatabaseCount('contact_inquiries', 0);
        Mail::assertNothingQueued();
    }

    public function test_contact_inquiry_is_rate_limited(): void
    {
        Mail::fake();
        Cache::flush();
        config(['services.contact.inquiry_to' => 'hello@lubartlab.test']);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->from('/en')->post('/en/contact', $this->validPayload([
                'email' => "founder{$attempt}@example.test",
            ]))->assertRedirect('/en');
        }

        $this->from('/en')
            ->post('/en/contact', $this->validPayload([
                'email' => 'founder-over-limit@example.test',
            ]))
            ->assertStatus(429);
    }

    /**
     * @param  array<string, string>  $overrides
     * @return array<string, string>
     */
    private function validPayload(array $overrides = []): array
    {
        return [
            'name' => 'Max Founder',
            'email' => 'founder@example.test',
            'company' => 'Acme Studio',
            'message' => 'We need a reliable product engineering team for a new workflow platform.',
            ...$overrides,
        ];
    }
}
