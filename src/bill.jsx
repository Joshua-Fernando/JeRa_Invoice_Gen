import React, { useState, useEffect } from 'react';

const DEFAULT_ADDRESS = {
    name: 'JeRa',
    subname: 'Jewellery',
    phone: '+91 91764 04179 / 98847 76974',
    address: 'FLAT NO. A/5, FIRST FLOOR, A WING, SILVER SPRINGS (CULBAVOUR CHS LTD.) OPP. PHOENIX MARKET CITY, BEHIND HDFC BANK, LBS MARG, KURLA WEST MUMBAI - 400070.',
};

export default function InvoiceGenerator() {
    const [customer, setCustomer] = useState({ name: '', phone: '', email: '', deliveryAddress: '' });
    const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, price: 0 }]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [date, setDate] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [addressMode, setAddressMode] = useState('default');
    const [customAddress, setCustomAddress] = useState({ name: '', subname: '', phone: '', address: '' });

    const fromAddress = addressMode === 'default' ? DEFAULT_ADDRESS : customAddress;

    useEffect(() => {
        setInvoiceNo('INV-' + Math.floor(100000 + Math.random() * 900000));
        const today = new Date();
        setDate(today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    }, []);

    const handleCustomerChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: field === 'description' ? value : Number(value) } : item
        ));
    };

    const grandTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const handlePrint = () => {
        const prevTitle = document.title;
        document.title = invoiceNo || 'Invoice';
        window.print();
        setTimeout(() => { document.title = prevTitle; }, 1000);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen font-sans text-gray-800">

            <style>{`
        @media print {
          .print-hide { display: none !important; }
          .print-expand { width: 100% !important; max-width: 100% !important; padding: 0 !important; }
          body { background-color: white; margin: 0; padding: 0; }
          @page { size: A4 landscape; margin: 0.4in; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

            {/* ══ LEFT PANEL: Form ══ */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200 print-hide">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Bill</h2>

                {/* FROM ADDRESS */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">From Address</h3>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="addressMode" value="default" checked={addressMode === 'default'} onChange={() => setAddressMode('default')} className="accent-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Default</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="addressMode" value="custom" checked={addressMode === 'custom'} onChange={() => setAddressMode('custom')} className="accent-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Custom</span>
                        </label>
                    </div>
                    {addressMode === 'default' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-gray-700 leading-relaxed">
                            <p className="font-bold">{DEFAULT_ADDRESS.name}</p>
                            <p className="text-gray-600">{DEFAULT_ADDRESS.subname}</p>
                            <p className="text-gray-600">{DEFAULT_ADDRESS.phone}</p>
                            <p className="text-gray-500 mt-1">{DEFAULT_ADDRESS.address}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input type="text" placeholder="Business Name (e.g., JeRa)" value={customAddress.name} onChange={(e) => setCustomAddress({ ...customAddress, name: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" placeholder="Tagline / Sub-name" value={customAddress.subname} onChange={(e) => setCustomAddress({ ...customAddress, subname: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="tel" placeholder="Phone Number" value={customAddress.phone} onChange={(e) => setCustomAddress({ ...customAddress, phone: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <textarea placeholder="Full Address" rows={3} value={customAddress.address} onChange={(e) => setCustomAddress({ ...customAddress, address: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        </div>
                    )}
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Customer Details</h3>
                    <input type="text" name="name" placeholder="Customer Name" value={customer.name} onChange={handleCustomerChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" name="phone" placeholder="Phone Number" value={customer.phone} onChange={handleCustomerChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="email" name="email" placeholder="Email Address" value={customer.email} onChange={handleCustomerChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    <textarea name="deliveryAddress" placeholder="Delivery Address" rows={3} value={customer.deliveryAddress} onChange={handleCustomerChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>

                {/* DELIVERY INFO */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Delivery Info</h3>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Invoice Number</label>
                        <input type="text" placeholder="e.g. INV-001" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                        <p className="text-xs text-gray-400 mt-1">This will also be the PDF filename when printing.</p>
                    </div>
                    <input type="text" placeholder="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Order Items</h3>
                    {items.map((item, index) => (
                        <div key={item.id} className="bg-white p-3 rounded shadow-sm border space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm text-gray-500">Item {index + 1}</span>
                                {items.length > 1 && (
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">✕ Remove</button>
                                )}
                            </div>
                            <input type="text" placeholder="Item Description (e.g., Gold Plated Ring)" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <div className="flex gap-3">
                                <input type="number" min="1" placeholder="Qty" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="w-1/3 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input type="number" min="0" placeholder="Price (₹)" value={item.price || ''} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="w-2/3 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    ))}
                    <button onClick={addItem} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded hover:bg-gray-300 transition">+ Add Another Item</button>
                </div>

                <button onClick={handlePrint} className="w-full bg-blue-600 text-white font-bold py-3 rounded shadow-md hover:bg-blue-700 transition">
                    🖨️ Print / Save PDF
                </button>
            </div>

            {/* ══ RIGHT PANEL: Invoice Preview ══ */}
            <div className="w-full md:w-2/3 bg-gray-100 p-6 flex justify-center overflow-y-auto print-expand">
                <div className="bg-white w-full max-w-4xl shadow-lg border border-gray-300 self-start print-expand print:shadow-none print:border-none">

                    {/* Top Banner */}
                    <div className="bg-gray-900 text-white px-8 py-5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img
                                src="/jera-logo.jpg"
                                alt="JeRa Logo"
                                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-600 shadow-lg"
                                style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                            />
                            <div>
                                <h1 className="text-3xl font-serif font-bold tracking-widest">{fromAddress.name || 'JeRa'}</h1>
                                {fromAddress.subname && <p className="text-gray-300 text-sm mt-0.5">{fromAddress.subname}</p>}
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-bold text-gray-500 uppercase tracking-widest">Invoice</h2>
                            <p className="text-gray-400 text-sm mt-1 font-mono tracking-wider">{invoiceNo}</p>
                        </div>
                    </div>

                    {/* Two-Column Body */}
                    <div className="flex divide-x divide-gray-200 min-h-[600px]">

                        {/* LEFT COLUMN — Delivery Details */}
                        <div className="w-1/2 p-7 space-y-6 bg-gray-50 text-sm">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">From</p>
                                <p className="font-bold text-gray-800">{fromAddress.name || '—'}</p>
                                {fromAddress.subname && <p className="text-gray-600">{fromAddress.subname}</p>}
                                {fromAddress.phone && <p className="text-gray-600">{fromAddress.phone}</p>}
                                {fromAddress.address && <p className="text-gray-500 mt-1 leading-relaxed">{fromAddress.address}</p>}
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Ship To</p>
                                <p className="font-bold text-gray-800">{customer.name || '—'}</p>
                                {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
                                {customer.email && <p className="text-gray-600">{customer.email}</p>}
                                {customer.deliveryAddress && (
                                    <p className="text-gray-500 mt-1 leading-relaxed whitespace-pre-line">{customer.deliveryAddress}</p>
                                )}
                            </div>

                            <hr className="border-gray-200" />

                            <div className="space-y-2.5">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Invoice Details</p>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Invoice No.</span>
                                    <span className="font-semibold text-gray-800">{invoiceNo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-semibold text-gray-800">{date}</span>
                                </div>
                                {trackingNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tracking No.</span>
                                        <span className="font-semibold text-gray-800">{trackingNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN — Bill & Items */}
                        <div className="w-1/2 p-7 flex flex-col">

                            <table className="w-full text-left mb-6 border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                                        <th className="p-2.5">Description</th>
                                        <th className="p-2.5 text-center w-10">Qty</th>
                                        <th className="p-2.5 text-right w-20">Price</th>
                                        <th className="p-2.5 text-right w-20">Amt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100 text-gray-700">
                                            <td className="p-2.5">{item.description || <span className="text-gray-400 italic">Item description...</span>}</td>
                                            <td className="p-2.5 text-center">{item.quantity}</td>
                                            <td className="p-2.5 text-right">₹{item.price.toFixed(2)}</td>
                                            <td className="p-2.5 text-right font-medium">₹{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-auto">
                                <div className="flex justify-between items-center border-t border-gray-200 py-2 text-sm text-gray-500">
                                    <span className="italic">Shipping</span>
                                    <span><span className="line-through text-gray-400 mr-2">₹100.00</span><span className="font-semibold text-green-600">FREE</span></span>
                                </div>
                                <div className="flex justify-between items-center border-t-2 border-gray-800 pt-3">
                                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="text-center text-gray-400 text-xs mt-8 pt-4 border-t border-gray-100">
                                <p className="font-medium text-gray-600">Thank you for shopping with JeRa! 💌</p>
                                <p className="mt-0.5">All sales are final. Handle your jewelry with care.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
