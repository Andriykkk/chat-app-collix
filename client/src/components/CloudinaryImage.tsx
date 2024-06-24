import Image from "next/image";
import React from "react";

interface CloudinaryImageProps {
  id: string;
  className?: string;
  alt?: string;
  [key: string]: any;
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  id,
  alt,
  className,
  ...props
}) => {
  return (
    <Image
      className={className}
      src={`https://res.cloudinary.com/dklmnmveq/image/upload/v1718615508/${id}.png`}
      alt={alt ? alt : "Preview"}
      {...props}
    />
  );
};

export default CloudinaryImage;
