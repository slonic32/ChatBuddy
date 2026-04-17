'use client';

export default function Error({ reset }) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p>Error loading this conversation.</p>
            <button onClick={reset} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded">
                Try again
            </button>
        </div>
    );
}
