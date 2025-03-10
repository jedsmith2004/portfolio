import { isFilled, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { components } from "@/slices";
import Heading from "@/components/Heading";
import { DateField } from "@prismicio/client";

export default function ContentBody({page}: {
    page: Content.BlogPostDocument | Content.ProjectDocument;
}) {
  function formatDate(date: DateField) {
    if (isFilled.date(date)) {
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        return new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(date));        
    }
  }

  const formattedDate = formatDate(page.data.date);
        
  return (
    <article className="px-4 py-10 md:px-6 md:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
            <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-900 px-4 py-10 md:px-8 md:py-20">
                <Heading as="h1">{page.data.title}</Heading>
                <div className="flex gap-4 text-red-500 text-xl font-bold">
                    {page.tags.map((tag, index)=>(
                        <span key={index}>{tag}</span>
                    ))}
                </div>
                <p className="mt-8 border-b border-zinc-600 text-xl font-medium text-slate-300">{formattedDate}</p>
                <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
                    <SliceZone slices={page.data.slices} components={components} />
                </div>
            </div>
        </div>
    </article>
    );
}