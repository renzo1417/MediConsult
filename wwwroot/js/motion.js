(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";
    const panelAnimations = new WeakMap();
    const closingDialogs = new WeakMap();
    let mountedPage = null;
    let generation = 0;

    function cancelAnimation(element) {
        const previous = panelAnimations.get(element);
        if (previous) previous.cancel();
        panelAnimations.delete(element);
    }

    function animatePanel(selector, animate = true) {
        const element = typeof selector === "string" ? document.querySelector(selector) : selector;
        if (!element) return;
        cancelAnimation(element);
        if (!animate || document.documentElement.dataset.input === "keyboard") return;
        const frames = reduceMotion.matches
            ? [{ opacity: 0.7 }, { opacity: 1 }]
            : [{ opacity: 0.5, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }];
        const animation = element.animate(frames, { duration: reduceMotion.matches ? 120 : 180, easing: easeOut });
        panelAnimations.set(element, animation);
        animation.finished.then(() => {
            if (panelAnimations.get(element) === animation) panelAnimations.delete(element);
            window.ScrollTrigger?.refresh(true);
        }).catch(() => {});
    }

    function hideNavigation() {
        document.querySelector(".mobile-navigation:popover-open")?.hidePopover();
    }

    function scrollToHash(hash, smooth = true, focus = false) {
        if (!hash) return false;
        let id;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
        const target = document.getElementById(id);
        if (!target) return false;
        target.scrollIntoView({ behavior: smooth && !reduceMotion.matches ? "smooth" : "instant", block: "start" });
        if (focus) {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        }
        return true;
    }

    function installNavigation(signal) {
        const links = [...document.querySelectorAll(".nav-links a, .nav-account a, .mobile-navigation a, .journey-nav a")];
        const sectionLinks = links.map(link => ({ link, url: new URL(link.href) }))
            .filter(({ url }) => url.pathname === location.pathname && url.hash);
        const sections = [...new Set(sectionLinks.map(({ url }) => document.getElementById(url.hash.slice(1))).filter(Boolean))];
        let frame = 0;

        function update() {
            frame = 0;
            const probe = window.innerHeight * 0.35;
            let current = null;
            for (const section of sections) {
                if (section.getBoundingClientRect().top <= probe) current = section.id;
            }
            for (const link of links) {
                const url = new URL(link.href);
                const isJourney = link.closest(".journey-nav");
                const state = url.pathname === location.pathname
                    ? (url.hash ? (url.hash.slice(1) === current ? (isJourney ? "step" : "location") : null) : "page")
                    : null;
                if (state) link.setAttribute("aria-current", state);
                else link.removeAttribute("aria-current");
            }
        }

        function schedule() {
            if (!frame) frame = requestAnimationFrame(update);
        }
        window.addEventListener("scroll", schedule, { passive: true, signal });
        window.addEventListener("resize", schedule, { passive: true, signal });
        window.addEventListener("hashchange", schedule, { signal });
        signal.addEventListener("abort", () => cancelAnimationFrame(frame), { once: true });
        update();
        return update;
    }

    function installMotion(main) {
        if (!window.gsap || !window.ScrollTrigger) return null;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add({
            full: "(prefers-reduced-motion: no-preference)",
            reduced: "(prefers-reduced-motion: reduce)"
        }, context => {
            const reduced = context.conditions.reduced;
            document.documentElement.dataset.motion = reduced ? "reduced" : "full";
            const hero = main.querySelector(".hero");
            if (!location.hash && hero) {
                const intro = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "transform,opacity" } });
                intro.fromTo(hero.querySelector("h1"), { opacity: reduced ? 0.8 : 0, y: reduced ? 0 : 24 },
                    { opacity: 1, y: 0, duration: reduced ? 0.12 : 0.65 }, 0);
                intro.fromTo(hero.querySelectorAll(".hero-support p, .hero-support small"),
                    { opacity: reduced ? 0.8 : 0, y: reduced ? 0 : 12 },
                    { opacity: 1, y: 0, duration: reduced ? 0.12 : 0.5, stagger: reduced ? 0 : 0.06 }, reduced ? 0 : 0.08);
                intro.fromTo(hero.querySelector(".hero-workspace"), { opacity: reduced ? 0.8 : 0, y: reduced ? 0 : 24 },
                    { opacity: 1, y: 0, duration: reduced ? 0.12 : 0.7 }, reduced ? 0 : 0.14);
            }
            // Forms stay stationary. Only their static image panel receives an entrance.
            const brand = main.querySelector(".auth-brand");
            if (brand && getComputedStyle(brand).display !== "none") {
                gsap.fromTo(brand, { opacity: reduced ? 0.8 : 0 },
                    { opacity: 1, duration: reduced ? 0.12 : 0.45, clearProps: "opacity" });
            }
            if (reduced) return;

            const groups = main.querySelectorAll(
                ".services .section-heading, .bento-grid, .process .section-heading, .process-layout, " +
                ".story-layout, .pricing-layout, .testimonials .section-heading, .testimonials .review-grid, " +
                ".faq-layout, .cta-panel, .journey-step, .rating-layout"
            );
            for (const group of groups) {
                if (group.getBoundingClientRect().bottom < 0) continue;
                const targets = group.matches(".bento-grid") ? [...group.children] : [group];
                gsap.fromTo(targets, { opacity: 0, y: 20 }, {
                    opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.06,
                    clearProps: "transform,opacity", immediateRender: false,
                    scrollTrigger: { trigger: group, start: "top 92%", once: true }
                });
            }
        }, main);
        return media;
    }

    async function mount(uri) {
        const url = new URL(uri, location.origin);
        const main = document.getElementById("main");
        const key = url.pathname + url.search;
        if (!main) return;
        if (mountedPage?.main === main && mountedPage.key === key) return;
        const token = ++generation;
        mountedPage?.controller.abort();
        mountedPage?.motion?.revert();
        const controller = new AbortController();
        const state = { main, key, controller, motion: null };
        mountedPage = state;
        hideNavigation();
        await document.fonts.ready;
        if (token !== generation || !main.isConnected) return;
        state.motion = installMotion(main);
        const updateNavigation = installNavigation(controller.signal);
        main.querySelectorAll("img[loading='lazy']").forEach(img => {
            if (!img.complete) img.addEventListener("load", () => window.ScrollTrigger?.refresh(true),
                { once: true, signal: controller.signal });
        });
        document.documentElement.dataset.interactiveReady = "true";
        // The router focuses the heading first. Resolve fragments after that render.
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (token !== generation) return;
            scrollToHash(location.hash, false);
            updateNavigation();
        }));
    }

    function openDialog(id, animate = true) {
        const dialog = document.getElementById(id);
        if (!dialog) return;
        const closing = closingDialogs.get(dialog);
        if (closing) { cancelAnimation(dialog); closingDialogs.delete(dialog); }
        dialog.removeAttribute("data-closing");
        if (!dialog.open) {
            dialog.returnFocus = document.activeElement;
            dialog.showModal();
        }
        if (!animate || reduceMotion.matches) return;
        cancelAnimation(dialog);
        const animation = dialog.animate(
            [{ opacity: 0, transform: "translateY(8px) scale(0.97)" }, { opacity: 1, transform: "translateY(0) scale(1)" }],
            { duration: 220, easing: easeOut });
        panelAnimations.set(dialog, animation);
        animation.finished.catch(() => {});
    }

    async function closeDialog(id, animate = true) {
        const dialog = document.getElementById(id);
        if (!dialog?.open || closingDialogs.has(dialog)) return;
        const token = {};
        closingDialogs.set(dialog, token);
        const style = getComputedStyle(dialog);
        const start = { opacity: style.opacity, transform: style.transform };
        cancelAnimation(dialog);
        if (animate && !reduceMotion.matches && document.documentElement.dataset.input !== "keyboard") {
            dialog.setAttribute("data-closing", "");
            const animation = dialog.animate(
                [start, { opacity: 0, transform: "translateY(8px) scale(0.97)" }],
                { duration: 180, easing: easeOut });
            panelAnimations.set(dialog, animation);
            await animation.finished.catch(() => {});
        }
        if (closingDialogs.get(dialog) !== token) return;
        cancelAnimation(dialog);
        closingDialogs.delete(dialog);
        dialog.close();
        dialog.removeAttribute("data-closing");
        if (dialog.returnFocus?.isConnected) dialog.returnFocus.focus({ preventScroll: true });
    }

    document.addEventListener("pointerdown", () => document.documentElement.dataset.input = "pointer", { passive: true });
    document.addEventListener("keydown", event => {
        document.documentElement.dataset.input = "keyboard";
        if (event.target.matches("[role='tab']") && ["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
            event.preventDefault();
    });
    document.addEventListener("toggle", event => {
        if (!event.target.matches(".mobile-navigation")) return;
        const trigger = document.querySelector("[popovertarget='mobile-navigation']");
        const open = event.newState === "open";
        trigger?.setAttribute("aria-expanded", String(open));
        trigger?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }, true);
    document.addEventListener("click", event => {
        if (event.target instanceof HTMLDialogElement && event.target.open) {
            const dialog = event.target;
            const bounds = dialog.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
                closeDialog(dialog.id, event.detail > 0);
            return;
        }
        const link = event.target.closest("a[href]");
        if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
            link.target === "_blank" || link.hasAttribute("download")) return;
        const href = link.getAttribute("href");
        const url = href.startsWith("#") ? new URL(href, location.href) : new URL(link.href);
        if (url.origin !== location.origin) return;
        hideNavigation();
        if (url.pathname === location.pathname && url.search === location.search && url.hash) {
            event.preventDefault();
            if (location.hash !== url.hash) history.pushState(null, "", url.href);
            scrollToHash(url.hash, true, event.detail === 0);
        }
    });
    window.addEventListener("popstate", () => scrollToHash(location.hash, false));

    window.mediConsult = {
        mount, animatePanel, openDialog, closeDialog,
        focusElement: id => document.getElementById(id)?.focus({ preventScroll: true })
    };
})();
