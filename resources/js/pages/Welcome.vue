<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { store } from '@/actions/App/Http/Controllers/ContactInquiryController';
import { landingContent } from '@/lib/landing-content';
import type { Locale } from '@/lib/landing-content';
import { show } from '@/routes/landing';

const props = defineProps<{
    locale: Locale;
}>();

const currentLocale = computed<Locale>(() =>
    props.locale === 'uk' ? 'uk' : 'en',
);
const alternateLocale = computed<Locale>(() =>
    currentLocale.value === 'en' ? 'uk' : 'en',
);
const content = computed(() => landingContent[currentLocale.value]);
const workSlides = computed(() => content.value.work.slides);
const selectedWork = computed(
    () => workSlides.value[carouselIndex.value] ?? workSlides.value[0],
);
const workSlideCountLabel = computed(() =>
    workSlides.value.length.toString().padStart(2, '0'),
);
const activeProcess = computed(
    () =>
        content.value.process.items[activeProcessIndex.value] ??
        content.value.process.items[0],
);
const form = useForm({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '',
});
const page = usePage<{
    flash?: {
        contactSubmitted?: boolean;
    };
}>();
const contactSubmitted = computed(
    () =>
        Boolean(page.props.flash?.contactSubmitted) || form.recentlySuccessful,
);

const menuOpen = ref(false);
const settingsOpen = ref(false);
const cursorEnabled = ref(false);
const cursorInteractive = ref(false);
const isReducedMotion = ref(false);
const carouselIndex = ref(0);
const activeProcessIndex = ref(0);

let revealObserver: IntersectionObserver | null = null;

watch(menuOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

onMounted(() => {
    const reducedMotionQuery = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    );
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const savedCursorPreference =
        window.localStorage.getItem('lubartlab-cursor');

    isReducedMotion.value = reducedMotionQuery.matches;
    cursorEnabled.value =
        finePointerQuery.matches &&
        !reducedMotionQuery.matches &&
        savedCursorPreference !== 'off';

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    setupRevealObserver();
});

onUnmounted(() => {
    revealObserver?.disconnect();
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('mousemove', handlePointerMove);
    document.body.style.overflow = '';
});

function setupRevealObserver(): void {
    const revealElements =
        document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (isReducedMotion.value || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) =>
            element.classList.add('is-visible'),
        );

        return;
    }

    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                revealObserver?.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
        },
    );

    revealElements.forEach((element, index) => {
        element.style.setProperty(
            '--reveal-delay',
            `${Math.min(index * 60, 360)}ms`,
        );
        revealObserver?.observe(element);
    });
}

function handlePointerMove(event: MouseEvent): void {
    if (!cursorEnabled.value) {
        return;
    }

    document.documentElement.style.setProperty(
        '--cursor-x',
        `${event.clientX}px`,
    );
    document.documentElement.style.setProperty(
        '--cursor-y',
        `${event.clientY}px`,
    );

    const target = event.target instanceof Element ? event.target : null;

    cursorInteractive.value = Boolean(
        target?.closest('a, button, input, textarea, [data-cursor="accent"]'),
    );
}

function handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
        return;
    }

    menuOpen.value = false;
    settingsOpen.value = false;
}

function toggleMenu(): void {
    menuOpen.value = !menuOpen.value;
}

function closeMenu(): void {
    menuOpen.value = false;
}

function toggleCursorPreference(): void {
    cursorEnabled.value = !cursorEnabled.value;
    window.localStorage.setItem(
        'lubartlab-cursor',
        cursorEnabled.value ? 'on' : 'off',
    );
}

function goToSlide(index: number): void {
    carouselIndex.value =
        (index + workSlides.value.length) % workSlides.value.length;
}

function nextSlide(): void {
    goToSlide(carouselIndex.value + 1);
}

function previousSlide(): void {
    goToSlide(carouselIndex.value - 1);
}

function setActiveProcess(index: number): void {
    activeProcessIndex.value = index;
}

function splitLabel(label: string): string[] {
    return Array.from(label.toUpperCase());
}

function accentTextClass(
    accent: 'orange' | 'sky' | 'emerald' | 'graphite',
): string {
    return {
        orange: 'text-orange-600',
        sky: 'text-sky-600',
        emerald: 'text-emerald-600',
        graphite: 'text-zinc-950',
    }[accent];
}

function accentDotClass(
    accent: 'orange' | 'sky' | 'emerald' | 'graphite',
): string {
    return {
        orange: 'bg-orange-500',
        sky: 'bg-sky-500',
        emerald: 'bg-emerald-500',
        graphite: 'bg-zinc-950',
    }[accent];
}

function submitInquiry(): void {
    form.transform((data) => ({
        ...data,
        company: data.company || null,
    })).submit(store(currentLocale.value), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
}
</script>

<template>
    <Head :title="content.meta.title">
        <meta name="description" :content="content.meta.description" />
    </Head>

    <div
        id="top"
        class="landing-shell min-h-screen overflow-x-hidden bg-white text-zinc-950 antialiased"
    >
        <div
            v-if="cursorEnabled && !isReducedMotion"
            class="cursor-ring"
            :class="{ 'is-interactive': cursorInteractive }"
            aria-hidden="true"
        ></div>
        <div
            v-if="cursorEnabled && !isReducedMotion"
            class="cursor-dot"
            :class="{ 'is-interactive': cursorInteractive }"
            aria-hidden="true"
        ></div>

        <header
            class="fixed inset-x-0 top-0 z-40 border-b border-zinc-950/10 bg-white/88 backdrop-blur-xl"
        >
            <div
                class="mx-auto flex h-20 max-w-[1480px] items-center justify-between gap-6 px-5 sm:px-6 lg:px-8"
            >
                <Link
                    :href="show(currentLocale)"
                    class="group flex items-center gap-3"
                    aria-label="LubartLab"
                >
                    <span
                        class="grid size-10 place-items-center rounded-lg bg-orange-500 font-display text-xl font-semibold text-white shadow-[0_16px_35px_rgba(249,115,22,0.25)] transition group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                    >
                        L.
                    </span>
                    <span
                        class="font-display text-2xl font-semibold text-zinc-950 uppercase"
                        >LubartLab</span
                    >
                </Link>

                <nav
                    class="hidden items-center gap-7 text-sm font-semibold text-zinc-700 lg:flex"
                    aria-label="Primary navigation"
                >
                    <a
                        v-for="item in content.nav"
                        :key="item.href"
                        :href="item.href"
                        class="menu-link group"
                    >
                        <span
                            v-for="(letter, index) in splitLabel(item.label)"
                            :key="`${item.href}-${index}`"
                            class="menu-letter"
                            :style="{ '--letter-index': index }"
                        >
                            {{ letter === ' ' ? '\u00a0' : letter }}
                        </span>
                    </a>
                </nav>

                <div class="flex items-center gap-2">
                    <Link
                        :href="show(alternateLocale)"
                        class="rounded-lg border border-zinc-950/10 px-3 py-2 font-display text-sm font-semibold text-zinc-800 uppercase transition hover:border-orange-300 hover:text-orange-600"
                    >
                        {{ alternateLocale.toUpperCase() }}
                    </Link>
                    <a
                        href="#contact"
                        class="hidden rounded-full border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:inline-flex"
                    >
                        {{ content.cta.start }}
                    </a>
                    <button
                        type="button"
                        class="dotted-menu"
                        :aria-expanded="menuOpen"
                        aria-controls="site-menu"
                        aria-label="Open navigation menu"
                        @click="toggleMenu"
                    >
                        <span
                            v-for="dot in 9"
                            :key="dot"
                            aria-hidden="true"
                        ></span>
                    </button>
                </div>
            </div>
        </header>

        <aside
            id="site-menu"
            class="offcanvas fixed inset-0 z-50 bg-white transition duration-500"
            :class="
                menuOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'pointer-events-none invisible -translate-y-6 opacity-0'
            "
            :aria-hidden="!menuOpen"
        >
            <div
                class="grid min-h-screen grid-cols-1 border-zinc-950/10 lg:grid-cols-[0.72fr_1.8fr_0.9fr]"
            >
                <div
                    class="flex flex-col justify-between border-b border-zinc-950/10 p-8 lg:border-r lg:border-b-0"
                >
                    <div>
                        <div class="flex items-center gap-3">
                            <span
                                class="grid size-12 place-items-center rounded-lg bg-orange-500 font-display text-2xl font-semibold text-white"
                                >L.</span
                            >
                            <span
                                class="font-display text-3xl font-semibold uppercase"
                                >LubartLab</span
                            >
                        </div>
                        <p
                            class="mt-8 max-w-sm text-lg leading-8 text-zinc-600"
                        >
                            {{ content.offcanvas.lead }}
                        </p>
                    </div>

                    <div class="mt-10">
                        <p class="font-display text-sm font-semibold uppercase">
                            {{ content.offcanvas.contactLabel }}
                        </p>
                        <a
                            :href="`mailto:${content.offcanvas.email}`"
                            class="mt-3 inline-flex text-lg font-semibold text-orange-600"
                        >
                            {{ content.offcanvas.email }}
                        </a>
                    </div>
                </div>

                <nav
                    class="flex flex-col justify-center border-b border-zinc-950/10 lg:border-r lg:border-b-0"
                    aria-label="Menu navigation"
                >
                    <a
                        v-for="item in content.nav"
                        :key="`menu-${item.href}`"
                        :href="item.href"
                        class="offcanvas-link"
                        @click="closeMenu"
                    >
                        <span>{{ item.label }}</span>
                    </a>
                </nav>

                <div class="relative flex flex-col justify-between p-8">
                    <button
                        type="button"
                        class="fixed top-5 right-5 z-20 grid size-14 place-items-center rounded-full bg-zinc-950 text-white transition hover:bg-orange-500 lg:static"
                        aria-label="Close navigation menu"
                        @click="closeMenu"
                    >
                        <svg
                            class="size-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="m6 6 12 12M18 6 6 18"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                    </button>

                    <p
                        class="max-w-xs font-display text-4xl leading-none font-semibold text-zinc-950 uppercase"
                    >
                        {{ content.offcanvas.title }}
                    </p>

                    <a href="#contact" class="circle-cta" @click="closeMenu">
                        <span>{{ content.cta.contact }}</span>
                        <svg
                            class="size-5"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 16 16 4M7 4h9v9"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </aside>

        <div class="fixed top-[42vh] right-0 z-30 hidden sm:block">
            <button
                type="button"
                class="settings-button"
                :aria-expanded="settingsOpen"
                aria-controls="motion-settings"
                aria-label="Open motion settings"
                @click="settingsOpen = !settingsOpen"
            >
                <svg
                    class="size-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M10 13.2A3.2 3.2 0 1 0 10 6.8a3.2 3.2 0 0 0 0 6.4Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                    />
                    <path
                        d="M10 2.5v2M10 15.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M14.6 5.4l-1.4 1.4M6.8 13.2l-1.4 1.4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            </button>
            <div
                id="motion-settings"
                class="settings-panel"
                :class="
                    settingsOpen
                        ? 'translate-x-0 opacity-100'
                        : 'pointer-events-none translate-x-4 opacity-0'
                "
            >
                <p class="font-display text-sm font-semibold uppercase">
                    Motion
                </p>
                <button
                    type="button"
                    class="mt-4 flex w-full items-center justify-between rounded-lg border border-zinc-950/10 px-3 py-2 text-sm font-semibold"
                    :aria-pressed="cursorEnabled"
                    @click="toggleCursorPreference"
                >
                    <span>Cursor ring</span>
                    <span class="text-orange-600">{{
                        cursorEnabled ? 'On' : 'Off'
                    }}</span>
                </button>
            </div>
        </div>

        <main>
            <section
                class="hero-section relative isolate overflow-hidden px-5 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-36"
            >
                <div
                    class="pointer-events-none absolute top-24 right-6 hidden size-24 rounded-full border border-zinc-950/10 lg:block"
                    aria-hidden="true"
                ></div>
                <div
                    class="pointer-events-none absolute top-36 right-24 hidden text-sky-500 lg:block"
                    aria-hidden="true"
                >
                    +
                </div>

                <div class="mx-auto max-w-[1480px]">
                    <div
                        class="mb-7 flex items-center gap-8 font-display text-xl font-semibold text-orange-600 uppercase"
                        data-reveal
                    >
                        <span>{{ content.hero.label }}</span>
                        <span class="h-px w-24 bg-zinc-950"></span>
                    </div>

                    <div class="relative">
                        <h1
                            class="hero-title font-display leading-none font-semibold text-zinc-950 uppercase"
                            :aria-label="content.hero.titleLines.join(' ')"
                            data-reveal
                        >
                            <span
                                v-for="line in content.hero.titleLines"
                                :key="line"
                                class="block"
                            >
                                {{ line }}
                            </span>
                        </h1>

                        <div
                            class="hero-media-strip"
                            data-cursor="accent"
                            data-reveal
                        >
                            <img
                                :src="content.hero.image"
                                :alt="content.hero.imageAlt"
                                class="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div
                        class="relative z-10 mt-10 grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end"
                    >
                        <p
                            class="max-w-xl text-2xl leading-9 font-medium text-zinc-700"
                            data-reveal
                        >
                            {{ content.hero.lead }}
                        </p>
                        <div
                            class="proof-rail grid gap-px overflow-hidden rounded-lg border border-zinc-950/10 bg-zinc-950/10 sm:grid-cols-2 lg:grid-cols-4"
                            data-reveal
                        >
                            <div
                                v-for="proof in content.hero.proof"
                                :key="proof"
                                class="bg-white px-5 py-4 font-display text-sm font-semibold text-zinc-800 uppercase"
                            >
                                {{ proof }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="services"
                class="section-block border-y border-zinc-950/10 bg-white px-5 sm:px-6 lg:px-8"
            >
                <div
                    class="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.9fr_1.1fr]"
                >
                    <div data-reveal>
                        <div class="section-kicker">
                            {{ content.why.title }}
                        </div>
                        <p
                            class="mt-8 max-w-2xl text-4xl leading-tight font-medium text-zinc-950 sm:text-5xl"
                        >
                            {{ content.why.lead }}
                        </p>
                    </div>

                    <div class="grid gap-10 lg:grid-cols-[0.88fr_0.12fr]">
                        <div data-reveal>
                            <p
                                class="max-w-2xl text-xl leading-9 text-zinc-600"
                            >
                                {{ content.why.body }}
                            </p>
                            <a href="#process" class="circle-cta mt-10">
                                <span>{{ content.why.cta }}</span>
                                <svg
                                    class="size-5"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 16 16 4M7 4h9v9"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                        <div
                            class="hidden min-h-64 border-l border-zinc-950/10 lg:block"
                            aria-hidden="true"
                        ></div>
                    </div>
                </div>

                <div
                    class="mx-auto mt-16 max-w-[1480px] overflow-hidden rounded-lg border border-zinc-950/10"
                    data-reveal
                >
                    <img
                        :src="content.why.image"
                        :alt="content.why.imageAlt"
                        class="aspect-[16/7] w-full object-cover"
                    />
                </div>
            </section>

            <section
                id="ai-delivery"
                class="section-block bg-zinc-50 px-5 sm:px-6 lg:px-8"
            >
                <div class="mx-auto max-w-[1480px]">
                    <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                        <div data-reveal>
                            <div class="section-kicker text-orange-600">
                                AI Delivery
                            </div>
                            <h2 class="editorial-heading mt-8">
                                {{ content.ai.title }}
                            </h2>
                        </div>
                        <div data-reveal>
                            <p
                                class="text-2xl leading-9 font-medium text-zinc-700"
                            >
                                {{ content.ai.lead }}
                            </p>
                            <p class="mt-6 text-lg leading-8 text-zinc-600">
                                {{ content.ai.body }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="mt-16 grid border-y border-zinc-950/10 lg:grid-cols-3"
                    >
                        <article
                            v-for="item in content.ai.items"
                            :key="item.label"
                            class="ai-row"
                            data-reveal
                        >
                            <h3
                                class="font-display text-3xl font-semibold text-zinc-950 uppercase"
                            >
                                {{ item.label }}
                            </h3>
                            <p class="mt-4 text-base leading-7 text-zinc-600">
                                {{ item.text }}
                            </p>
                        </article>
                    </div>

                    <div
                        class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-zinc-700"
                        data-reveal
                    >
                        <span
                            v-for="guardrail in content.ai.safeguards"
                            :key="guardrail"
                            class="inline-flex items-center gap-3"
                        >
                            <span
                                class="size-2 rounded-full bg-emerald-500"
                                aria-hidden="true"
                            ></span>
                            {{ guardrail }}
                        </span>
                    </div>
                </div>
            </section>

            <section
                id="work"
                class="section-block relative overflow-hidden bg-white px-5 sm:px-6 lg:px-8"
            >
                <div
                    class="pointer-events-none absolute top-20 left-1/2 hidden -translate-x-1/2 font-display text-[9rem] leading-none font-semibold text-zinc-950/[0.04] uppercase lg:block xl:text-[12rem]"
                    aria-hidden="true"
                >
                    {{ selectedWork.title }}
                </div>

                <div class="relative z-10 mx-auto max-w-[1480px]">
                    <div
                        class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
                    >
                        <div data-reveal>
                            <div class="section-kicker">
                                {{ content.work.title }}
                            </div>
                            <p
                                class="mt-8 max-w-2xl text-xl leading-9 text-zinc-600"
                            >
                                {{ content.work.lead }}
                            </p>
                        </div>

                        <div
                            class="flex items-center justify-between border-t border-zinc-950/10 pt-6"
                            data-reveal
                        >
                            <p class="font-display text-5xl font-semibold">
                                {{ selectedWork.number }}
                                <span class="text-2xl text-zinc-400"
                                    >/ {{ workSlideCountLabel }}</span
                                >
                            </p>
                            <div class="flex gap-3">
                                <button
                                    type="button"
                                    class="carousel-button"
                                    aria-label="Previous work slide"
                                    @click="previousSlide"
                                >
                                    <svg
                                        class="size-5"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M12.5 4.5 7 10l5.5 5.5M7.5 10H16"
                                            stroke="currentColor"
                                            stroke-width="1.8"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="carousel-button"
                                    aria-label="Next work slide"
                                    @click="nextSlide"
                                >
                                    <svg
                                        class="size-5"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M7.5 4.5 13 10l-5.5 5.5M4 10h8.5"
                                            stroke="currentColor"
                                            stroke-width="1.8"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        class="mt-16 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
                    >
                        <div
                            class="work-visual"
                            data-cursor="accent"
                            data-reveal
                        >
                            <img
                                :src="selectedWork.image"
                                :alt="selectedWork.imageAlt"
                                class="aspect-[4/3] w-full object-cover"
                            />
                        </div>

                        <div data-reveal>
                            <p
                                class="font-display text-sm font-semibold text-orange-600 uppercase"
                            >
                                {{ selectedWork.subtitle }}
                            </p>
                            <h2
                                class="mt-5 font-display text-6xl leading-none font-semibold text-zinc-950 uppercase sm:text-7xl"
                            >
                                {{ selectedWork.title }}
                            </h2>
                            <p
                                class="mt-7 max-w-xl text-lg leading-8 text-zinc-600"
                            >
                                {{ selectedWork.text }}
                            </p>
                            <div class="mt-8 flex flex-wrap gap-2">
                                <button
                                    v-for="(slide, index) in workSlides"
                                    :key="slide.number"
                                    type="button"
                                    class="slide-dot"
                                    :class="{
                                        'is-active': index === carouselIndex,
                                    }"
                                    :aria-label="`Show ${slide.title}`"
                                    :aria-pressed="index === carouselIndex"
                                    @click="goToSlide(index)"
                                >
                                    {{ slide.number }}
                                </button>
                            </div>
                            <div class="mt-8 flex flex-wrap gap-2">
                                <span
                                    v-for="tag in selectedWork.tags"
                                    :key="tag"
                                    class="rounded-lg border border-zinc-950/10 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700"
                                >
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="process"
                class="section-block border-y border-zinc-950/10 bg-white px-5 sm:px-6 lg:px-8"
            >
                <div
                    class="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-start"
                >
                    <div data-reveal>
                        <div class="tilted-panel">
                            <img
                                :src="content.process.image"
                                :alt="content.process.imageAlt"
                                class="aspect-[5/4] w-full object-cover"
                            />
                        </div>
                        <p
                            class="mt-10 max-w-lg text-xl leading-8 text-zinc-600"
                        >
                            {{ content.process.lead }}
                        </p>
                    </div>

                    <div>
                        <div class="section-kicker" data-reveal>
                            {{ content.process.title }}
                        </div>

                        <div class="mt-12 border-y border-zinc-950/10">
                            <button
                                v-for="(step, index) in content.process.items"
                                :key="step.number"
                                type="button"
                                class="process-row"
                                :class="{
                                    'is-active': index === activeProcessIndex,
                                }"
                                @click="setActiveProcess(index)"
                                @mouseenter="setActiveProcess(index)"
                            >
                                <span
                                    class="font-display text-2xl font-semibold"
                                    :class="accentTextClass(step.accent)"
                                >
                                    {{ step.number }}
                                </span>
                                <span>
                                    <span
                                        class="block font-display text-5xl leading-none font-semibold text-zinc-950 uppercase"
                                        >{{ step.label }}</span
                                    >
                                    <span
                                        class="mt-3 block max-w-xl text-left text-base leading-7 text-zinc-600"
                                        >{{ step.text }}</span
                                    >
                                </span>
                                <span class="process-arrow" aria-hidden="true">
                                    <svg
                                        class="size-8"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                    >
                                        <path
                                            d="M8 24 24 8M12 8h12v12"
                                            stroke="currentColor"
                                            stroke-width="2.2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </div>

                        <div
                            class="mt-8 flex items-center gap-3 text-sm font-semibold text-zinc-600"
                            data-reveal
                        >
                            <span
                                class="size-3 rounded-full"
                                :class="accentDotClass(activeProcess.accent)"
                                aria-hidden="true"
                            ></span>
                            {{ activeProcess.label }}
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-zinc-50 px-5 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-[1480px]">
                    <h2
                        class="max-w-3xl font-display text-5xl leading-none font-semibold text-zinc-950 uppercase"
                        data-reveal
                    >
                        {{ content.proof.title }}
                    </h2>
                    <div
                        class="mt-12 grid border-y border-zinc-950/10 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        <article
                            v-for="item in content.proof.items"
                            :key="item.label"
                            class="proof-item"
                            data-reveal
                        >
                            <h3
                                class="font-display text-2xl font-semibold uppercase"
                            >
                                {{ item.label }}
                            </h3>
                            <p class="mt-4 text-base leading-7 text-zinc-600">
                                {{ item.text }}
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section
                id="contact"
                class="section-block bg-white px-5 sm:px-6 lg:px-8"
            >
                <div
                    class="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.85fr_1.15fr]"
                >
                    <div data-reveal>
                        <div class="section-kicker">
                            {{ content.contact.title }}
                        </div>
                        <p
                            class="mt-8 max-w-2xl font-display text-4xl leading-none font-semibold text-zinc-950 uppercase sm:text-6xl lg:text-7xl"
                        >
                            {{ content.contact.lead }}
                        </p>
                        <p
                            class="mt-10 max-w-xl border-l-2 border-orange-500 pl-5 text-lg leading-8 text-zinc-600"
                        >
                            {{ content.contact.note }}
                        </p>
                    </div>

                    <form
                        class="contact-form"
                        data-reveal
                        @submit.prevent="submitInquiry"
                    >
                        <div class="hidden">
                            <label for="website">{{
                                content.contact.fields.trap
                            }}</label>
                            <input
                                id="website"
                                v-model="form.website"
                                name="website"
                                type="text"
                                tabindex="-1"
                                autocomplete="off"
                            />
                        </div>

                        <div class="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label for="name" class="form-label">{{
                                    content.contact.fields.name
                                }}</label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    name="name"
                                    type="text"
                                    autocomplete="name"
                                    :placeholder="
                                        content.contact.placeholders.name
                                    "
                                    class="form-field"
                                />
                                <p v-if="form.errors.name" class="form-error">
                                    {{ form.errors.name }}
                                </p>
                            </div>

                            <div>
                                <label for="email" class="form-label">{{
                                    content.contact.fields.email
                                }}</label>
                                <input
                                    id="email"
                                    v-model="form.email"
                                    name="email"
                                    type="email"
                                    autocomplete="email"
                                    :placeholder="
                                        content.contact.placeholders.email
                                    "
                                    class="form-field"
                                />
                                <p v-if="form.errors.email" class="form-error">
                                    {{ form.errors.email }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-5">
                            <label for="company" class="form-label">{{
                                content.contact.fields.company
                            }}</label>
                            <input
                                id="company"
                                v-model="form.company"
                                name="company"
                                type="text"
                                autocomplete="organization"
                                :placeholder="
                                    content.contact.placeholders.company
                                "
                                class="form-field"
                            />
                            <p v-if="form.errors.company" class="form-error">
                                {{ form.errors.company }}
                            </p>
                        </div>

                        <div class="mt-5">
                            <label for="message" class="form-label">{{
                                content.contact.fields.message
                            }}</label>
                            <textarea
                                id="message"
                                v-model="form.message"
                                name="message"
                                rows="6"
                                :placeholder="
                                    content.contact.placeholders.message
                                "
                                class="form-field resize-y"
                            ></textarea>
                            <p v-if="form.errors.message" class="form-error">
                                {{ form.errors.message }}
                            </p>
                        </div>

                        <div
                            class="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="submit-button"
                            >
                                {{
                                    form.processing
                                        ? content.cta.sending
                                        : content.cta.contact
                                }}
                                <svg
                                    class="size-5"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 16 16 4M7 4h9v9"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>

                            <p
                                v-if="contactSubmitted"
                                class="text-sm font-semibold text-emerald-700"
                            >
                                {{ content.cta.success }}
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    </div>
</template>
