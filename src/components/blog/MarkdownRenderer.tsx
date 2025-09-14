import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className 
}) => {
  return (
    <div className={cn(
      "prose prose-lg max-w-none text-foreground leading-relaxed",
      "prose-headings:text-foreground prose-headings:font-bold",
      "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-6",
      "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4", 
      "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3",
      "prose-p:mb-4 prose-p:text-foreground",
      "prose-ul:mb-4 prose-ol:mb-4",
      "prose-li:text-foreground prose-li:mb-1",
      "prose-strong:text-foreground prose-strong:font-semibold",
      "prose-em:italic",
      "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
      "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto",
      "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
      "prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80",
      "prose-img:rounded-lg prose-img:shadow-lg",
      "prose-table:border-collapse prose-table:border prose-table:border-border",
      "prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left",
      "prose-td:border prose-td:border-border prose-td:p-2",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-foreground mt-8 mb-6 scroll-mt-16">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 scroll-mt-16">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3 scroll-mt-16">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 text-foreground leading-relaxed">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 ml-6 list-disc space-y-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-6 list-decimal space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground">
            {children}
          </li>
        ),
        code: ({ children, ...props }) => (
          'inline' in props ? (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ) : (
            <code className="block bg-muted p-4 rounded-lg overflow-x-auto font-mono text-sm">
              {children}
            </code>
          )
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img 
            src={src} 
            alt={alt} 
            className="rounded-lg shadow-lg max-w-full h-auto my-4"
            loading="lazy"
          />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted p-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border p-2">
            {children}
          </td>
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};