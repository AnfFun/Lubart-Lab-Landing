<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Connectors\PostgresConnector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('db.connector.pgsql', function (): PostgresConnector {
            return new class extends PostgresConnector
            {
                /**
                 * Create a DSN string from a configuration.
                 *
                 * Neon requires the endpoint id when the PHP runtime's libpq does
                 * not support SNI, while Laravel's `options` config key is reserved
                 * for PDO options. Keep those separate by adding the Postgres
                 * startup option directly to the DSN.
                 *
                 * @param  array<string, mixed>  $config
                 */
                protected function getDsn(array $config): string
                {
                    $dsn = parent::getDsn($config);
                    $endpoint = $config['endpoint'] ?? null;

                    if (is_string($endpoint) && $endpoint !== '') {
                        $escapedEndpoint = str_replace(['\\', "'"], ['\\\\', "\\'"], $endpoint);

                        $dsn .= ";options='endpoint={$escapedEndpoint}'";
                    }

                    return $dsn;
                }
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure application rate limiters.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('contact-inquiry', function (Request $request): Limit {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
