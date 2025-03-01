import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `ImageBlock`.
 */
export type ImageBlockProps = SliceComponentProps<Content.ImageBlockSlice>;

/**
 * Component for "ImageBlock" Slices.
 */
const ImageBlock: FC<ImageBlockProps> = ({ slice }) => {
  return (
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
      <PrismicNextImage field={slice.primary.image} imgixParams={{ w: 600 }} style={{ width: "60%", height: "auto" }} />
    </div>
  );
};

export default ImageBlock;