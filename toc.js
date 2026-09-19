// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="foreword.html">Foreword</a></li><li class="chapter-item expanded affix "><li class="part-title">Part I: Before the Bell</li><li class="chapter-item expanded "><a href="p1-01-the-announcer.html"><strong aria-hidden="true">1.</strong> The Announcer</a></li><li class="chapter-item expanded "><a href="p1-02-the-cell.html"><strong aria-hidden="true">2.</strong> The Cell</a></li><li class="chapter-item expanded "><a href="p1-03-rules-of-the-match.html"><strong aria-hidden="true">3.</strong> Rules of the Match</a></li><li class="chapter-item expanded "><a href="p1-04-your-corner.html"><strong aria-hidden="true">4.</strong> Your Corner</a></li><li class="chapter-item expanded affix "><li class="part-title">Part II: The Kata</li><li class="chapter-item expanded "><a href="p2-01-the-manifest.html"><strong aria-hidden="true">5.</strong> The Manifest</a></li><li class="chapter-item expanded "><a href="p2-02-the-library.html"><strong aria-hidden="true">6.</strong> The Library</a></li><li class="chapter-item expanded "><a href="p2-03-the-binary.html"><strong aria-hidden="true">7.</strong> The Binary</a></li><li class="chapter-item expanded "><a href="p2-04-the-referee.html"><strong aria-hidden="true">8.</strong> The Referee</a></li><li class="chapter-item expanded "><a href="p2-05-ding-ding.html"><strong aria-hidden="true">9.</strong> Ding Ding</a></li><li class="chapter-item expanded affix "><li class="part-title">Part III: The Fight, Round by Round</li><li class="chapter-item expanded "><a href="p3-01-round-1-the-manifest.html"><strong aria-hidden="true">10.</strong> Round 1: The Manifest</a></li><li class="chapter-item expanded "><a href="p3-02-round-2-the-types.html"><strong aria-hidden="true">11.</strong> Round 2: The Types</a></li><li class="chapter-item expanded "><a href="p3-03-round-3-the-name.html"><strong aria-hidden="true">12.</strong> Round 3: The Name</a></li><li class="chapter-item expanded "><a href="p3-04-round-4-the-greeting.html"><strong aria-hidden="true">13.</strong> Round 4: The Greeting</a></li><li class="chapter-item expanded "><a href="p3-05-round-5-the-doc-test.html"><strong aria-hidden="true">14.</strong> Round 5: The Doc Test</a></li><li class="chapter-item expanded "><a href="p3-06-round-6-clippy.html"><strong aria-hidden="true">15.</strong> Round 6: Clippy</a></li><li class="chapter-item expanded "><a href="p3-07-round-7-format.html"><strong aria-hidden="true">16.</strong> Round 7: Format</a></li><li class="chapter-item expanded "><a href="p3-08-round-8-docs.html"><strong aria-hidden="true">17.</strong> Round 8: Docs</a></li><li class="chapter-item expanded "><a href="p3-09-round-9-the-referee.html"><strong aria-hidden="true">18.</strong> Round 9: The Referee</a></li><li class="chapter-item expanded "><a href="p3-10-round-10-the-undercard.html"><strong aria-hidden="true">19.</strong> Round 10: The Undercard</a></li><li class="chapter-item expanded "><a href="p3-11-the-scorecard.html"><strong aria-hidden="true">20.</strong> The Scorecard</a></li><li class="chapter-item expanded affix "><li class="part-title">Part IV: Man vs. Machine</li><li class="chapter-item expanded "><a href="p4-01-rules-of-engagement.html"><strong aria-hidden="true">21.</strong> Rules of Engagement</a></li><li class="chapter-item expanded "><a href="p4-02-copilot.html"><strong aria-hidden="true">22.</strong> CoPilot</a></li><li class="chapter-item expanded "><a href="p4-03-fable.html"><strong aria-hidden="true">23.</strong> Fable</a></li><li class="chapter-item expanded "><a href="p4-04-chatgpt.html"><strong aria-hidden="true">24.</strong> ChatGPT</a></li><li class="chapter-item expanded "><a href="p4-05-gemini.html"><strong aria-hidden="true">25.</strong> Gemini</a></li><li class="chapter-item expanded "><a href="p4-06-the-final-bell.html"><strong aria-hidden="true">26.</strong> The Final Bell</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="appendix-resources.html">Appendix: Resources</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
