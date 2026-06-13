<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreContactInquiryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:180'],
            'company' => ['nullable', 'string', 'max:140'],
            'message' => ['required', 'string', 'min:20', 'max:5000'],
            'website' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function inquiryData(): array
    {
        $validated = $this->validated();

        return [
            ...$validated,
            'locale' => (string) $this->route('locale'),
            'ip_address' => $this->ip(),
            'user_agent' => $this->userAgent(),
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if (! in_array($this->route('locale'), ['en', 'uk'], true)) {
                $validator->errors()->add('locale', 'The selected locale is invalid.');
            }
        });
    }
}
