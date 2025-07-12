// app/edit/page.js
import React, { Suspense } from 'react';
import EditProduct from './EditProduct';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading Edit Page...</div>}>
      <EditProduct />
    </Suspense>
  );
};

export default Page;
