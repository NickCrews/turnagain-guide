'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

function LeftArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  )
}

export function Modal({ children, mountId }: { children: React.ReactNode, mountId: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // we only have access to the DOM after the component is mounted
    return null;
  }

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-black/90">
      <dialog
        ref={dialogRef}
        className="bg-white p-6 max-w-lg w-full max-h-screen overflow-auto rounded-lg shadow-lg"
      >
        <nav className="flex justify-start">
          <button onClick={onDismiss} className="close-button flex items-center gap-1">
            <LeftArrowIcon />
            <span className="text-sm">Back to search</span>
          </button>
        </nav>
        {children}
      </dialog>
    </div>,
    document.getElementById(mountId)!
  );
}
