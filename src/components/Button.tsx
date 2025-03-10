import { KeyTextField, LinkField, FilledLinkToWebField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import { MdArrowOutward } from "react-icons/md";

type ButtonProps = {
  linkField: LinkField;
  label: KeyTextField;
  showIcon?: boolean;
  className?: string;
};

// Type guard for a filled web link field.
function isFilledWebLinkField(link: LinkField): link is FilledLinkToWebField {
  return (
    "link_type" in link &&
    link.link_type === "Web" &&
    typeof (link as FilledLinkToWebField).url === "string"
  );
}

export default function Button({
  linkField,
  label,
  showIcon = true,
  className,
}: ButtonProps) {
  if (isFilledWebLinkField(linkField)) {
    const url = linkField.url;
    // Check if the URL is an email address.
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url);
    if (isEmail) {
      // Encode the subject for the mailto link.
      const subject = encodeURIComponent("🤝Let's talk");
      const emailHref = `mailto:${url}?subject=${subject}`;
      return (
        <a
          href={emailHref}
          className={clsx(
            "group relative flex w-fit text-slate-800 items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-50 px-4 py-2 font-bold transition-transform ease-out hover:scale-105",
            className
          )}
        >
          <span className="absolute inset-0 z-0 h-full translate-y-9 bg-red-500 transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>
          <span className="relative flex items-center justify-center gap-2">
            {label} {showIcon && <MdArrowOutward className="inline-block" />}
          </span>
        </a>
      );
    }
  }
  
  // Render the PrismicNextLink for non-email links.
  return (
    <PrismicNextLink
      field={linkField}
      className={clsx(
        "group relative flex w-fit text-slate-800 items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-50 px-4 py-2 font-bold transition-transform ease-out hover:scale-105",
        className
      )}
    >
      <span className="absolute inset-0 z-0 h-full translate-y-9 bg-red-500 transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>
      <span className="relative flex items-center justify-center gap-2">
        {label} {showIcon && <MdArrowOutward className="inline-block" />}
      </span>
    </PrismicNextLink>
  );
}
