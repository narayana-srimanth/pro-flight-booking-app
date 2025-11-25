import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaWindowClose } from 'react-icons/fa';

/**
 * Reusable Modal component for displaying booking confirmation or error messages.
 * Features good CSS for transitions and a clear display of booking details.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {string} props.title - The title of the modal (e.g., "Booking Successful!").
 * @param {string} props.message - The main message to display.
 * @param {boolean} props.success - True if the booking was successful, false otherwise.
 * @param {string} [props.bookingId] - Optional: The booking ID if the booking was successful.
 * @param {number} [props.finalAmount] - Optional: The final amount if the booking was successful.
 */
const BookingModal = ({ isOpen, onClose, title, message, success, bookingId, finalAmount }) => {
  if (!isOpen) return null;

  const modalClasses = `
    fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `;

  const contentClasses = `
    bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 ease-out
    ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-4'}
  `;

  return (
    <div className={modalClasses} onClick={onClose}>
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Close modal"
          >
            <FaWindowClose size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center text-center mt-4">
          {success ? (
            <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce-in" />
          ) : (
            <FaTimesCircle className="text-red-500 text-6xl mb-4 animate-shake" />
          )}
          <h3 className={`text-2xl font-bold ${success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} mb-3`}>
            {title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>

          {success && (
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md w-full">
              {bookingId && <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Booking ID: <span className="text-blue-600 dark:text-blue-400">{bookingId}</span></p>}
              {finalAmount && <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Total Amount: <span className="text-blue-600 dark:text-blue-400">${finalAmount.toFixed(2)}</span></p>}
            </div>
          )}

          <button
            onClick={onClose}
            className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-bold text-lg tracking-wide transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 ${
              success
                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:ring-green-400 dark:focus:ring-green-600'
                : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:ring-red-400 dark:focus:ring-red-600'
            }`}
          >
            {success ? 'View Bookings' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
