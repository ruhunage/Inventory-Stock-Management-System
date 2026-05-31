import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Lanka Traders PVT LTD</h3>
            <p>Premium electronics at great prices. Phones, laptops, audio, gaming and more.</p>
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Customer Care</h3>
            <ul className="space-y-2">
              <li>Orders & Shipping</li>
              <li>Returns & Warranty</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-500">© {new Date().getFullYear()} TecnoBuy. All rights reserved.</div>
      </div>
    </footer>
  );
}


