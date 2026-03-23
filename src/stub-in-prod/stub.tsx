// import dynamic from 'next/dynamic'
// import process from 'process';
// import * as React from 'react';

// // type PropsOf<T extends React.ElementType> = React.ComponentProps<T>;



// export type ProdStubProps<T extends React.ElementType = React.ElementType> = {
//   importPath: string;
//   props?: React.ComponentProps<T>;
// }

// export function ProdStub<T extends React.ElementType>(props: ProdStubProps<T>) {
//   const { importPath } = props;
//   if (process.env.NODE_ENV === 'production') {
//     return <div className="p-4 bg-red-100 text-red-700 rounded">component {importPath} is not available in production.</div>;
//   }

//   const RealComponent = dynamic(
//     () => import(importPath),
//     {
//       loading: () => <p>Loading...</p>,
//       ssr: false,
//     }
//   )
//   return <RealComponent {...props.props} />;

// }
export function stubInProdFn<T extends (...args: any[]) => any>(fn: T, name: string): T {
  console.warn(`StubInProdFn called for ${name}. This should have been replaced with the real function in development, or a no-op in production.`);
  return (() => {
    console.warn(`Attempted to call ${name}, but it's not available.`);
  }) as T;
}