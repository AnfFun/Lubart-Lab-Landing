<x-mail::message>
# New LubartLab inquiry

**Name:** {{ $inquiry->name }}

**Email:** {{ $inquiry->email }}

**Company:** {{ $inquiry->company ?: 'Not provided' }}

**Language:** {{ strtoupper($inquiry->locale) }}

**Message**

{{ $inquiry->message }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
