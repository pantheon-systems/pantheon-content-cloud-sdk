import React, { ReactElement } from "react";
import { Link } from "gatsby";

/**
 * Type predicate to determine if a FooterMenuItem has a parent or parentId
 * @param {FooterMenuItem} item a `FooterMenuItem`
 * @returns true if `parentId` or `parent` properties are found on the `FooterMenuItem`
 */
const hasParent = (item) => (item.parentId ? true : item.parent ? true : false);

export const Footer = ({ footerMenuItems, children }) => {
  const FooterMenu = () => {
    const menuArr: ReactElement[] = [];

    if (footerMenuItems) {
      // some not so great code to account for nested menu elements
      for (let i = 0; i < footerMenuItems.length; i++) {
        if (footerMenuItems[i + 1] && hasParent(footerMenuItems[i + 1])) {
          menuArr.push(
            <ul key={i}>
              <li className="text-blue-300 list-disc">
                <Link
                  to={footerMenuItems[i].href}
                  className="text-blue-300 hover:underline hover:text-blue-100 focus:text-purple-600 active:text-purple-300"
                >
                  {footerMenuItems[i].linkText}
                </Link>
              </li>
              <li className="ml-3 text-blue-300 list-disc">
                <Link
                  to={footerMenuItems[i + 1].href}
                  className="text-blue-300 hover:underline hover:text-blue-100 focus:text-purple-600 active:text-purple-300"
                >
                  {footerMenuItems[i + 1].linkText}
                </Link>
              </li>
            </ul>
          );
          // increment iterator to skip the next render
          i++;
        } else {
          menuArr.push(
            <li key={i} className="text-blue-300 list-disc">
              <Link
                to={footerMenuItems[i].href}
                className="text-blue-300 hover:underline hover:text-blue-100 focus:text-purple-600 active:text-purple-300"
              >
                {footerMenuItems[i].linkText}
              </Link>
            </li>
          );
        }
      }
    }
    return (
      <nav className="flex flex-col max-w-lg mx-auto lg:max-w-screen-lg">
        <ul>{menuArr?.map((menu) => menu)}</ul>
      </nav>
    );
  };
  return (
    <footer className="w-full p-4 mt-12 text-white bg-black">
      <FooterMenu />
      <div className="flex p-2 my-4">{children}</div>
    </footer>
  );
};
