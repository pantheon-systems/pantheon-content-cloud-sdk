"use strict";
exports.id = 454;
exports.ids = [454];
exports.modules = {

/***/ 2454:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7647);
/* harmony import */ var _pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);



function Layout({ children, footerMenu, preview }) {
    const navItems = [
        {
            linkText: "\uD83C\uDFE0 Home",
            href: "/"
        },
        {
            linkText: "\uD83D\uDCD1 Articles",
            href: "/articles"
        },
        {
            linkText: "⚛️ Examples",
            href: "/examples"
        }
    ];
    const footerMenuItems = footerMenu?.map(({ path, label })=>({
            linkText: label,
            href: path,
            parent: null
        }));
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "min-h-screen max-h-screen min-w-screen max-w-screen flex flex-col overflow-x-hidden",
        children: [
            preview && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_1__.PreviewRibbon, {}),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "ps-my-0 ps-pt-10 ps-px-5 ps-text-xl",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("nav", {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                        className: "ps-flex ps-flex-row ps-flex-wrap sm:ps-flex-nowrap ps-list-none ps-justify-between max-w-screen-lg ps-mx-auto",
                        children: navItems.map((item)=>{
                            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                className: `${item.href === "/" ? "ps-mr-auto" : "ps-mx-4"}`,
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                    className: "ps-font-sans hover:ps-underline",
                                    href: item.href,
                                    children: item.linkText
                                })
                            }, item.href);
                        })
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("main", {
                className: "mb-auto",
                children: children
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_1__.Footer, {
                footerMenuItems: footerMenuItems,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                    className: "mx-auto",
                    children: [
                        "\xa9 ",
                        new Date().getFullYear(),
                        " Built with",
                        " ",
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                            className: "text-white hover:text-blue-100 underline",
                            href: "https://nextjs.org/",
                            children: "Next.js"
                        }),
                        " ",
                        "and",
                        " ",
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                            className: "text-blue-500 underline hover:text-blue-100",
                            href: "https://pantheon.com/",
                            children: "Pantheon Content Cloud"
                        })
                    ]
                })
            })
        ]
    });
}


/***/ })

};
;