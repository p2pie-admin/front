import React from "react";

interface RichTextProps {
  sanitizedHTML: string;
}

const RichText = ({ sanitizedHTML }: RichTextProps) => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default RichText;
