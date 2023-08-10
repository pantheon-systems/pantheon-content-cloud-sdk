"use strict";
exports.id = 825;
exports.ids = [825];
exports.modules = {

/***/ 4524:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ PostGrid),
/* harmony export */   k: () => (/* binding */ PageGrid)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7647);
/* harmony import */ var _pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_3__);




const GradientPlaceholder = ()=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "w-full h-full bg-gradient-to-b from-blue-100 to-blue-500"
    });
const GridItem = ({ href, imgSrc, altText, title })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
        passHref: true,
        href: href,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "flex flex-col rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 h-full hover:border-indigo-500",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "flex-shrink-0 relative h-40",
                    children: imgSrc !== null ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                        src: imgSrc,
                        fill: true,
                        alt: altText,
                        style: {
                            objectFit: "cover"
                        }
                    }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(GradientPlaceholder, {})
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h2", {
                    className: "my-4 mx-6 text-xl leading-7 font-semibold text-gray-900",
                    children: [
                        title,
                        " →"
                    ]
                })
            ]
        })
    });
};
const PostGridItem = ({ content: article })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(GridItem, {
        href: `/articles/${article.id}`,
        imgSrc: null,
        title: article.title
    });
};
const PageGridItem = ({ content: article })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(GridItem, {
        href: `/articles/${article.id}`,
        imgSrc: null,
        title: article.title
    });
};
const PostGrid = (0,_pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_3__.withGrid)(PostGridItem);
const PageGrid = (0,_pantheon_systems_nextjs_kit__WEBPACK_IMPORTED_MODULE_3__.withGrid)(PageGridItem);


/***/ }),

/***/ 6795:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   y: () => (/* binding */ pantheonClient)
/* harmony export */ });
/* harmony import */ var _pantheon_systems_pcc_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4084);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_pantheon_systems_pcc_react_sdk__WEBPACK_IMPORTED_MODULE_0__]);
_pantheon_systems_pcc_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const pantheonClient = new _pantheon_systems_pcc_react_sdk__WEBPACK_IMPORTED_MODULE_0__.PantheonClient({
    pccHost: process.env.PCC_HOST,
    siteId: process.env.PCC_SITE_ID,
    apiKey: process.env.PCC_API_KEY
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;