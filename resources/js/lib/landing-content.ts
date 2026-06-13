export type Locale = 'en' | 'uk';

type NavItem = {
    label: string;
    href: string;
};

type CtaText = {
    start: string;
    work: string;
    contact: string;
    sending: string;
    success: string;
};

type HeroContent = {
    label: string;
    titleLines: string[];
    lead: string;
    proof: string[];
    image: string;
    imageAlt: string;
};

type TextBlock = {
    title: string;
    lead: string;
    body?: string;
};

type AiItem = {
    label: string;
    text: string;
};

type WorkSlide = {
    number: string;
    title: string;
    subtitle: string;
    text: string;
    tags: string[];
    image: string;
    imageAlt: string;
};

type ProcessItem = {
    number: string;
    label: string;
    text: string;
    accent: 'orange' | 'sky' | 'emerald' | 'graphite';
};

type ProofItem = {
    label: string;
    text: string;
};

export type LandingContent = {
    meta: {
        title: string;
        description: string;
    };
    nav: NavItem[];
    cta: CtaText;
    offcanvas: {
        title: string;
        lead: string;
        contactLabel: string;
        email: string;
    };
    hero: HeroContent;
    why: TextBlock & {
        cta: string;
        image: string;
        imageAlt: string;
    };
    ai: TextBlock & {
        items: AiItem[];
        safeguards: string[];
    };
    work: TextBlock & {
        slides: WorkSlide[];
    };
    process: TextBlock & {
        image: string;
        imageAlt: string;
        items: ProcessItem[];
    };
    proof: {
        title: string;
        items: ProofItem[];
    };
    contact: {
        title: string;
        lead: string;
        fields: {
            name: string;
            email: string;
            company: string;
            message: string;
            trap: string;
        };
        placeholders: {
            name: string;
            email: string;
            company: string;
            message: string;
        };
        note: string;
    };
};

export const landingContent: Record<Locale, LandingContent> = {
    en: {
        meta: {
            title: 'LubartLab - Senior Product Engineering',
            description:
                'LubartLab builds reliable web platforms, AI workflow automation, and senior product engineering teams for calm delivery.',
        },
        nav: [
            { label: 'Home', href: '#top' },
            { label: 'Services', href: '#services' },
            { label: 'Process', href: '#process' },
            { label: 'AI Delivery', href: '#ai-delivery' },
            { label: 'Work', href: '#work' },
            { label: 'Contact', href: '#contact' },
        ],
        cta: {
            start: 'Start a project',
            work: 'See how we work',
            contact: 'Tell us about your project',
            sending: 'Sending...',
            success: 'Thanks. We saved your inquiry and will reply soon.',
        },
        offcanvas: {
            title: 'Senior product engineering with visible decisions.',
            lead: 'Use the menu to jump through the delivery story, or send a short brief and we will reply with practical next steps.',
            contactLabel: 'Get in touch',
            email: 'hello@lubartlab.com',
        },
        hero: {
            label: 'Product engineering',
            titleLines: ['LubartLab', 'builds software'],
            lead: 'Senior product engineering for calm, reliable delivery.',
            proof: [
                'Laravel / Vue platforms',
                'AI workflow automation',
                'Weekly demos',
                'Clear ownership',
            ],
            image: '/images/lubartlab-workflow-strip.png',
            imageAlt:
                'LubartLab engineers reviewing workflows, code, and product architecture in a bright studio',
        },
        why: {
            title: 'Why LubartLab?',
            lead: 'Software delivery is not only code. It is decisions, systems, feedback loops, and the discipline to keep them clear.',
            body: 'We help product and operations teams shape ambiguous work into useful releases, then keep senior engineers close to architecture, implementation, review, and quality.',
            cta: 'See how we work',
            image: '/images/lubartlab-process-room.png',
            imageAlt:
                'Senior product engineers shaping architecture and workflow decisions',
        },
        ai: {
            title: 'AI delivery without losing human ownership.',
            lead: 'We use AI to shorten feedback loops, reduce repetitive work, and make product decisions easier to inspect.',
            body: 'The result is not automated noise. It is faster discovery, sharper prototypes, cleaner review loops, and documentation that stays useful.',
            items: [
                {
                    label: 'Discovery that moves',
                    text: 'Requirements, notes, and edge cases become mapped decisions instead of scattered context.',
                },
                {
                    label: 'Prototype faster',
                    text: 'Interface and workflow options are explored quickly before production effort is committed.',
                },
                {
                    label: 'Review deeper',
                    text: 'AI-assisted review and test planning give senior engineers stronger signals earlier.',
                },
            ],
            safeguards: [
                'Architecture stays human-reviewed.',
                'Security and privacy decisions are explicit.',
                'Generated work is tested, reviewed, and explained.',
            ],
        },
        work: {
            title: 'Selected systems we are built to ship.',
            lead: 'A few product patterns that match the way LubartLab works: clear ownership, useful automation, and visible delivery states.',
            slides: [
                {
                    number: '01',
                    title: 'AI workflow platform',
                    subtitle:
                        'Research, approvals, and reporting in one operating rhythm.',
                    text: 'Manual research and QA steps become guided workflows with human approval points, audit trails, and practical automation.',
                    tags: ['Laravel', 'Vue', 'AI workflows'],
                    image: '/images/lubartlab-ai-platform.png',
                    imageAlt:
                        'AI workflow platform dashboard with automation states and approval queues',
                },
                {
                    number: '02',
                    title: 'Operations dashboard',
                    subtitle:
                        'Roles, states, and decisions visible to every team.',
                    text: 'Legacy processes become web platforms with dashboards, role-based flows, and measurable delivery transitions.',
                    tags: ['Dashboards', 'Integrations', 'Operations'],
                    image: '/images/lubartlab-workflow-strip.png',
                    imageAlt:
                        'Product team reviewing workflow architecture in a bright engineering studio',
                },
                {
                    number: '03',
                    title: 'Dedicated product team',
                    subtitle:
                        'A compact senior unit connected to your roadmap.',
                    text: 'A focused engineering team joins product planning, builds important paths first, and keeps decisions understandable.',
                    tags: ['Senior team', 'Product shape', 'Delivery'],
                    image: '/images/lubartlab-process-room.png',
                    imageAlt:
                        'Senior team reviewing product architecture and delivery plans',
                },
            ],
        },
        process: {
            title: 'A rhythm for work that has to get real.',
            lead: 'The process is intentionally visible: each phase has a decision, a deliverable, and a next useful step.',
            image: '/images/lubartlab-process-room.png',
            imageAlt:
                'LubartLab team planning product architecture and delivery slices',
            items: [
                {
                    number: '01',
                    label: 'Discover',
                    text: 'Clarify the business goal, users, constraints, and the first useful release.',
                    accent: 'orange',
                },
                {
                    number: '02',
                    label: 'Shape',
                    text: 'Turn ambiguity into scope, architecture, delivery slices, and risk controls.',
                    accent: 'sky',
                },
                {
                    number: '03',
                    label: 'Build',
                    text: 'Ship working increments with senior review, tests, and weekly demos.',
                    accent: 'emerald',
                },
                {
                    number: '04',
                    label: 'Improve',
                    text: 'Measure, refine, automate, and keep the platform healthy after launch.',
                    accent: 'graphite',
                },
            ],
        },
        proof: {
            title: 'Built for teams that value clarity.',
            items: [
                {
                    label: 'Senior team',
                    text: 'Experienced engineers stay close to architecture, delivery, and tradeoffs.',
                },
                {
                    label: 'Weekly demos',
                    text: 'You see working progress often, not only status updates.',
                },
                {
                    label: 'Clear ownership',
                    text: 'One accountable team handles product thinking, build, and quality.',
                },
                {
                    label: 'Delivery rhythm',
                    text: 'Predictable iterations keep risks and decisions visible.',
                },
            ],
        },
        contact: {
            title: 'Tell us about your project',
            lead: 'Share what you are building, where the risk is, and what a useful first release should prove.',
            fields: {
                name: 'Name',
                email: 'Email',
                company: 'Company',
                message: 'Project details',
                trap: 'Website',
            },
            placeholders: {
                name: 'Your name',
                email: 'you@company.com',
                company: 'Company or product',
                message: 'What are you building? What should improve first?',
            },
            note: 'We reply with practical next steps, not a generic sales script.',
        },
    },
    uk: {
        meta: {
            title: 'LubartLab - Senior Product Engineering',
            description:
                'LubartLab створює надійні web-платформи, AI workflow automation і senior product engineering teams для спокійного delivery.',
        },
        nav: [
            { label: 'Home', href: '#top' },
            { label: 'Послуги', href: '#services' },
            { label: 'Процес', href: '#process' },
            { label: 'AI Delivery', href: '#ai-delivery' },
            { label: 'Роботи', href: '#work' },
            { label: 'Контакт', href: '#contact' },
        ],
        cta: {
            start: 'Почати проєкт',
            work: 'Як ми працюємо',
            contact: 'Розкажіть про проєкт',
            sending: 'Надсилаємо...',
            success: 'Дякуємо. Ми зберегли заявку і скоро відповімо.',
        },
        offcanvas: {
            title: 'Senior product engineering з видимими рішеннями.',
            lead: 'Перейдіть до потрібного блоку або надішліть короткий brief, і ми відповімо практичними наступними кроками.',
            contactLabel: 'Звʼязатися',
            email: 'hello@lubartlab.com',
        },
        hero: {
            label: 'Product engineering',
            titleLines: ['LubartLab', 'builds software'],
            lead: 'Senior product engineering для спокійного і надійного delivery.',
            proof: [
                'Laravel / Vue platforms',
                'AI workflow automation',
                'Щотижневі демо',
                'Чітка ownership',
            ],
            image: '/images/lubartlab-workflow-strip.png',
            imageAlt:
                'Інженери LubartLab обговорюють workflows, код і продуктову архітектуру у світлій студії',
        },
        why: {
            title: 'Чому LubartLab?',
            lead: 'Software delivery - це не тільки код. Це рішення, системи, feedback loops і дисципліна тримати все прозорим.',
            body: 'Ми допомагаємо продуктовим та операційним командам перетворювати нечітку роботу на корисні релізи, а senior engineers залишаються близько до архітектури, реалізації, review і якості.',
            cta: 'Як ми працюємо',
            image: '/images/lubartlab-process-room.png',
            imageAlt:
                'Senior product engineers формують архітектуру та workflow-рішення',
        },
        ai: {
            title: 'AI delivery без втрати людської відповідальності.',
            lead: 'Ми використовуємо AI, щоб скорочувати feedback loops, прибирати повторювану роботу і робити продуктові рішення легшими для перевірки.',
            body: 'Результат - не автоматизований шум. Це швидший discovery, чіткіші прототипи, сильніші review loops і документація, яка лишається корисною.',
            items: [
                {
                    label: 'Discovery рухається',
                    text: 'Вимоги, нотатки та edge cases стають мапою рішень, а не розкиданим контекстом.',
                },
                {
                    label: 'Прототипи швидше',
                    text: 'Варіанти інтерфейсів і workflows перевіряються до production-розробки.',
                },
                {
                    label: 'Review глибше',
                    text: 'AI-assisted review і test planning дають senior engineers сильніші сигнали раніше.',
                },
            ],
            safeguards: [
                'Архітектура проходить людське review.',
                'Security і privacy рішення фіксуються явно.',
                'Згенерована робота тестується, ревʼюється і пояснюється.',
            ],
        },
        work: {
            title: 'Системи, які ми створені запускати.',
            lead: 'Продуктові патерни, де LubartLab найсильніший: clear ownership, корисна автоматизація і видимі delivery states.',
            slides: [
                {
                    number: '01',
                    title: 'AI workflow platform',
                    subtitle:
                        'Research, approvals і reporting в одному operating rhythm.',
                    text: 'Ручні research і QA кроки стають керованими workflows з human approval points, audit trails і практичною автоматизацією.',
                    tags: ['Laravel', 'Vue', 'AI workflows'],
                    image: '/images/lubartlab-ai-platform.png',
                    imageAlt:
                        'Dashboard AI workflow platform з automation states і approval queues',
                },
                {
                    number: '02',
                    title: 'Operations dashboard',
                    subtitle: 'Ролі, стани і рішення видимі для всієї команди.',
                    text: 'Legacy-процеси стають web-платформами з dashboards, role-based flows і вимірюваними delivery transitions.',
                    tags: ['Dashboards', 'Integrations', 'Operations'],
                    image: '/images/lubartlab-workflow-strip.png',
                    imageAlt:
                        'Продуктова команда переглядає workflow architecture у світлій engineering studio',
                },
                {
                    number: '03',
                    title: 'Dedicated product team',
                    subtitle:
                        'Компактна senior unit, підключена до вашого roadmap.',
                    text: 'Сфокусована engineering team входить у product planning, будує важливі сценарії першими і тримає рішення зрозумілими.',
                    tags: ['Senior team', 'Product shape', 'Delivery'],
                    image: '/images/lubartlab-process-room.png',
                    imageAlt:
                        'Senior team переглядає продуктову архітектуру і delivery plans',
                },
            ],
        },
        process: {
            title: 'Ритм для роботи, яка має стати реальною.',
            lead: 'Процес навмисно видимий: кожна фаза має рішення, deliverable і наступний корисний крок.',
            image: '/images/lubartlab-process-room.png',
            imageAlt:
                'Команда LubartLab планує product architecture і delivery slices',
            items: [
                {
                    number: '01',
                    label: 'Discover',
                    text: 'Уточнюємо бізнес-ціль, користувачів, обмеження і перший корисний реліз.',
                    accent: 'orange',
                },
                {
                    number: '02',
                    label: 'Shape',
                    text: 'Перетворюємо невизначеність у scope, архітектуру, delivery slices і контроль ризиків.',
                    accent: 'sky',
                },
                {
                    number: '03',
                    label: 'Build',
                    text: 'Постачаємо робочі інкременти з senior review, тестами і щотижневими демо.',
                    accent: 'emerald',
                },
                {
                    number: '04',
                    label: 'Improve',
                    text: 'Міряємо, покращуємо, автоматизуємо і підтримуємо платформу після запуску.',
                    accent: 'graphite',
                },
            ],
        },
        proof: {
            title: 'Для команд, які цінують ясність.',
            items: [
                {
                    label: 'Senior team',
                    text: 'Досвідчені інженери тримають фокус на архітектурі, delivery і tradeoffs.',
                },
                {
                    label: 'Щотижневі демо',
                    text: 'Ви бачите робочий прогрес регулярно, а не тільки статуси в чаті.',
                },
                {
                    label: 'Чітка ownership',
                    text: 'Одна відповідальна команда веде продуктове мислення, розробку і якість.',
                },
                {
                    label: 'Delivery rhythm',
                    text: 'Передбачувані ітерації тримають ризики та рішення видимими.',
                },
            ],
        },
        contact: {
            title: 'Розкажіть про ваш проєкт',
            lead: 'Опишіть, що ви будуєте, де найбільший ризик і що має довести перший корисний реліз.',
            fields: {
                name: 'Імʼя',
                email: 'Email',
                company: 'Компанія',
                message: 'Деталі проєкту',
                trap: 'Website',
            },
            placeholders: {
                name: 'Ваше імʼя',
                email: 'you@company.com',
                company: 'Компанія або продукт',
                message: 'Що будуєте? Що треба покращити першим?',
            },
            note: 'Ми відповідаємо практичними наступними кроками, а не generic sales script.',
        },
    },
};
