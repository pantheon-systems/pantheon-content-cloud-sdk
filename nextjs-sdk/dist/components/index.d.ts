import React from 'react';
import { a as Article } from '../index-e9db137d.js';

interface Props {
    article?: Article;
    bodyClassName?: string;
    containerClassName?: string;
    headerClassName?: string;
    renderTitle?: (titleElement: React.ReactElement) => React.ReactNode;
}
declare const ArticleRenderer: ({ article, headerClassName, bodyClassName, containerClassName, renderTitle, }: Props) => JSX.Element;

export { ArticleRenderer };
