import React from 'react';

const iFrame = ({ src, ...props }) => {
  return (
    <iframe src={src} {...props}></iframe>
  )
}

export default iFrame;
